import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth';

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

    const { data, error } = await supabase
      .from('dynamic_activities')
      .update(updateData)
      .eq('id', Number(id))
      .select();

    if (error) throw error;

    return NextResponse.json({
      message: 'تم تحديث البيانات بنجاح',
      item: data[0],
    });
  } catch (error) {
    console.error('Error updating dynamic activity:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث بيانات النشاط' },
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
    const { error } = await supabase
      .from('dynamic_activities')
      .delete()
      .eq('id', Number(id));

    if (error) throw error;

    return NextResponse.json({ message: 'تم حذف النشاط بنجاح' });
  } catch (error) {
    console.error('Error deleting dynamic activity:', error);
    return NextResponse.json(
      { error: 'فشل في حذف النشاط' },
      { status: 500 }
    );
  }
}
