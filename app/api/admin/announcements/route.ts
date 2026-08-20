import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin, isServiceRoleConfigured } from '@/lib/supabaseAdmin';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let title = '';
    let date = '';
    let description = '';
    let imageFile: File | null = null;

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      title = (formData.get('title') as string) || '';
      date = (formData.get('date') as string) || '';
      description = (formData.get('description') as string) || '';
      const file = formData.get('image') as File | null;
      if (file && file.size > 0) {
        imageFile = file;
      }
    } else {
      const body = await req.json();
      title = body.title || '';
      date = body.date || '';
      description = body.description || '';
    }

    if (!title.trim() && !description.trim() && !imageFile) {
      return NextResponse.json(
        { error: 'محتوى المنشور لا يمكن أن يكون فارغاً' },
        { status: 400 }
      );
    }

    // Auto-generate date if not specified
    if (!date.trim()) {
      const now = new Date();
      date = now.toLocaleDateString('ar-EG', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    }

    let imageUrl: string | null = null;
    let storagePath: string | null = null;

    // Handle Storage image upload if file is attached
    if (imageFile) {
      if (!isServiceRoleConfigured()) {
        console.error('[SupabaseAdmin] SUPABASE_SERVICE_ROLE_KEY is missing on server!');
        return NextResponse.json(
          {
            error:
              'فشل رفع الصورة: SUPABASE_SERVICE_ROLE_KEY غير معرف في إعدادات البيئة بالخادم (Server Environment Variables)',
          },
          { status: 500 }
        );
      }

      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 9);
      const filename = `posts/${timestamp}_${randomStr}.webp`;

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('post-images')
        .upload(filename, buffer, {
          contentType: 'image/webp',
          upsert: true,
        });

      if (uploadError) {
        console.error('Detailed Supabase Storage Upload Error:', {
          message: uploadError.message,
          name: uploadError.name,
          error: (uploadError as any).error,
          statusCode: (uploadError as any).statusCode || (uploadError as any).status,
          filename,
        });

        return NextResponse.json(
          {
            error: `حدث خطأ أثناء رفع الصورة إلى المجلد (post-images): ${uploadError.message}`,
            details: uploadError.message,
          },
          { status: 500 }
        );
      }

      storagePath = uploadData.path;
      const { data: publicUrlData } = supabaseAdmin.storage
        .from('post-images')
        .getPublicUrl(storagePath);
      imageUrl = publicUrlData.publicUrl;
    }

    // Insert database record
    const { data, error } = await supabaseAdmin
      .from('announcements')
      .insert([
        {
          title,
          date,
          description,
          image_url: imageUrl,
          storage_path: storagePath,
        },
      ])
      .select();

    if (error) {
      console.error('Detailed Supabase DB Insert Error:', error);
      // Orphan Cleanup: Delete uploaded storage file if DB insert fails
      if (storagePath) {
        await supabaseAdmin.storage.from('post-images').remove([storagePath]);
      }
      return NextResponse.json(
        {
          error: `حدث خطأ أثناء إضافة البيانات في الجدول: ${error.message}`,
          details: error.message,
        },
        { status: 500 }
      );
    }

    try {
      revalidatePath('/');
      revalidatePath('/api/announcements');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json(
      { id: data[0]?.id, message: 'تم إضافة المنشور بنجاح', data: data[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Unhandled Error adding announcement/post:', error);
    return NextResponse.json(
      { error: `فشل إضافة المنشور: ${error?.message || 'خطأ غير معروف'}` },
      { status: 500 }
    );
  }
}

