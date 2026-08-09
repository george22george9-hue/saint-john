import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getAuthUser } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // 1. Fetch post to get storage_path
    const { data: post, error: fetchError } = await supabaseAdmin
      .from('announcements')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !post) {
      return NextResponse.json(
        { error: 'المنشور غير موجود' },
        { status: 404 }
      );
    }

    // 2. Permanently delete image object from Supabase Storage if storage_path exists
    if (post.storage_path) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('post-images')
        .remove([post.storage_path]);

      if (storageError) {
        console.error('Detailed Supabase Storage Delete Error:', storageError);
        return NextResponse.json(
          { error: `فشل حذف الصورة من مجلد التخزين: ${storageError.message}` },
          { status: 500 }
        );
      }
    }

    // 3. Delete database record
    const { error: deleteError } = await supabaseAdmin
      .from('announcements')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Detailed Supabase DB Delete Error:', deleteError);
      return NextResponse.json(
        { error: `فشل حذف المنشور من قاعدة البيانات: ${deleteError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'تم حذف المنشور والصورة بنجاح',
    });
  } catch (error: any) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { error: `فشل حذف المنشور: ${error?.message || 'خطأ غير معروف'}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Fetch current post record
    const { data: currentPost, error: fetchError } = await supabaseAdmin
      .from('announcements')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentPost) {
      return NextResponse.json(
        { error: 'المنشور غير موجود' },
        { status: 404 }
      );
    }

    let title = currentPost.title;
    let date = currentPost.date;
    let description = currentPost.description;
    let removeImage = false;
    let newImageFile: File | null = null;

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      if (formData.has('title')) title = formData.get('title') as string;
      if (formData.has('date')) date = formData.get('date') as string;
      if (formData.has('description')) description = formData.get('description') as string;
      removeImage = formData.get('remove_image') === 'true';
      const file = formData.get('image') as File | null;
      if (file && file.size > 0) {
        newImageFile = file;
      }
    } else {
      const body = await req.json();
      if (body.title !== undefined) title = body.title;
      if (body.date !== undefined) date = body.date;
      if (body.description !== undefined) description = body.description;
      removeImage = body.remove_image === true;
    }

    let finalImageUrl = currentPost.image_url;
    let finalStoragePath = currentPost.storage_path;
    let newlyUploadedPath: string | null = null;

    // Handle Image Removal
    if (removeImage && !newImageFile) {
      if (currentPost.storage_path) {
        const { error: removeErr } = await supabaseAdmin.storage
          .from('post-images')
          .remove([currentPost.storage_path]);

        if (removeErr) {
          console.error('Error removing storage file during image removal:', removeErr);
          return NextResponse.json(
            { error: `فشل حذف الصورة من مجلد التخزين: ${removeErr.message}` },
            { status: 500 }
          );
        }
      }
      finalImageUrl = null;
      finalStoragePath = null;
    }
    // Handle Image Replacement
    else if (newImageFile) {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 9);
      const filename = `posts/${timestamp}_${randomStr}.webp`;

      const arrayBuffer = await newImageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('post-images')
        .upload(filename, buffer, {
          contentType: 'image/webp',
          upsert: true,
        });

      if (uploadError) {
        console.error('Detailed Supabase Storage Replacement Error:', uploadError);
        return NextResponse.json(
          { error: `حدث خطأ أثناء رفع الصورة الجديدة: ${uploadError.message}` },
          { status: 500 }
        );
      }

      newlyUploadedPath = uploadData.path;
      const { data: publicUrlData } = supabaseAdmin.storage
        .from('post-images')
        .getPublicUrl(newlyUploadedPath);

      finalImageUrl = publicUrlData.publicUrl;
      finalStoragePath = newlyUploadedPath;
    }

    // Update database record
    const { data: updatedData, error: updateError } = await supabaseAdmin
      .from('announcements')
      .update({
        title,
        date,
        description,
        image_url: finalImageUrl,
        storage_path: finalStoragePath,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (updateError) {
      console.error('Detailed Supabase DB Update Error:', updateError);
      // Orphan Cleanup: if DB update fails and we uploaded a new image, delete newly uploaded file
      if (newlyUploadedPath) {
        await supabaseAdmin.storage.from('post-images').remove([newlyUploadedPath]);
      }
      return NextResponse.json(
        { error: `فشل تحديث بيانات المنشور: ${updateError.message}` },
        { status: 500 }
      );
    }

    // IF replacement succeeded, delete OLD storage file
    if (newlyUploadedPath && currentPost.storage_path) {
      const { error: oldDeleteErr } = await supabaseAdmin.storage
        .from('post-images')
        .remove([currentPost.storage_path]);

      if (oldDeleteErr) {
        console.error('Warning: Failed to remove old storage file after replacement:', oldDeleteErr);
      }
    }

    return NextResponse.json({
      message: 'تم تحديث المنشور بنجاح',
      data: updatedData[0],
    });
  } catch (error: any) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      { error: `فشل تحديث المنشور: ${error?.message || 'خطأ غير معروف'}` },
      { status: 500 }
    );
  }
}
