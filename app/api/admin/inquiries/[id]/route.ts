import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { supabase as supabasePublic } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth';

const client = supabaseAdmin || supabasePublic;

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

    const { data, error } = await client
      .from('inquiries')
      .update({ status })
      .eq('id', Number(id))
      .select();

    if (error) {
      console.error('[Admin Inquiry PATCH Error]:', {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      return NextResponse.json(
        {
          error: 'فشل في تحديث حالة الرسالة. يرجى التأكد من تشغيل ملف supabase_migration.sql في Supabase.',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'تم تحديث حالة الرسالة بنجاح',
      inquiry: data[0],
    });
  } catch (error: any) {
    console.error('Error updating inquiry status:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث حالة الرسالة', details: error?.message },
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
      .from('inquiries')
      .delete()
      .eq('id', Number(id));

    if (error) {
      console.error('[Admin Inquiry DELETE Error]:', {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      return NextResponse.json(
        {
          error: 'فشل في حذف الرسالة',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'تم حذف الرسالة بنجاح' });
  } catch (error: any) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json(
      { error: 'فشل في حذف الرسالة', details: error?.message },
      { status: 500 }
    );
  }
}
