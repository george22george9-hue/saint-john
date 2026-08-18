import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth';

export async function PATCH(
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
    const { status } = body;

    const validStatuses = ['تحت المراجعة', 'جاري التنفيذ', 'تم التنفيذ', 'مرفوض'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'حالة غير صالحة' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', Number(id))
      .select();

    if (error) throw error;

    return NextResponse.json({
      message: 'تم تحديث حالة الرسالة بنجاح',
      inquiry: data[0],
    });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث حالة الرسالة' },
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
      .from('inquiries')
      .delete()
      .eq('id', Number(id));

    if (error) throw error;

    return NextResponse.json({ message: 'تم حذف الرسالة بنجاح' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json(
      { error: 'فشل في حذف الرسالة' },
      { status: 500 }
    );
  }
}
