import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { supabase as supabasePublic } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth';

const client = supabaseAdmin || supabasePublic;

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
    const body = await req.json();
    const { title, subtitle, category, content, date, time, is_active, display_order } = body;

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = String(title).trim();
    if (subtitle !== undefined) updateData.subtitle = subtitle ? String(subtitle).trim() : null;
    if (category !== undefined) updateData.category = category ? String(category).trim() : 'نشاط';
    if (content !== undefined) updateData.content = content ? String(content).trim() : null;
    if (date !== undefined) updateData.date = date ? String(date).trim() : null;
    if (time !== undefined) updateData.time = time ? String(time).trim() : null;
    if (is_active !== undefined) updateData.is_active = Boolean(is_active);
    if (display_order !== undefined) updateData.display_order = Number(display_order);

    const { data, error } = await client
      .from('dynamic_activities')
      .update(updateData)
      .eq('id', Number(id))
      .select();

    if (error) {
      console.error('[Admin Dynamic Activity PUT Error]:', {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      return NextResponse.json(
        {
          error: 'فشل في تحديث بيانات النشاط',
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    try {
      revalidatePath('/api/activities');
      revalidatePath('/');
    } catch (e) {
      console.warn('revalidatePath error:', e);
    }

    return NextResponse.json({
      message: 'تم تحديث البيانات بنجاح',
      item: data[0],
    });
  } catch (error: any) {
    console.error('Error updating dynamic activity:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث بيانات النشاط', details: error?.message },
      { status: 500 }
    );
  }
}

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
    const { error } = await client
      .from('dynamic_activities')
      .delete()
      .eq('id', Number(id));

    if (error) {
      console.error('[Admin Dynamic Activity DELETE Error]:', {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      return NextResponse.json(
        {
          error: 'فشل في حذف النشاط',
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    try {
      revalidatePath('/api/activities');
      revalidatePath('/');
    } catch (e) {
      console.warn('revalidatePath error:', e);
    }

    return NextResponse.json({ message: 'تم حذف النشاط بنجاح' });
  } catch (error: any) {
    console.error('Error deleting dynamic activity:', error);
    return NextResponse.json(
      { error: 'فشل في حذف النشاط', details: error?.message },
      { status: 500 }
    );
  }
}
