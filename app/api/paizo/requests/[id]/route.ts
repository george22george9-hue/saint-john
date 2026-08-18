import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// PATCH /api/paizo/requests/[id] - Update request status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'البيانات غير كافية للتعديل.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('paizo_design_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating PAIZO request:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    console.error('Error in PATCH /api/paizo/requests/[id]:', err);
    return NextResponse.json({ error: 'حدث خطأ أثناء تعديل الحالة.' }, { status: 500 });
  }
}

// DELETE /api/paizo/requests/[id] - Delete request
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'المعرف غير صالح.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('paizo_design_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting PAIZO request:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Error in DELETE /api/paizo/requests/[id]:', err);
    return NextResponse.json({ error: 'حدث خطأ أثناء حذف الطلب.' }, { status: 500 });
  }
}
