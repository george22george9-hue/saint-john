import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from('dynamic_activities')
      .select('*')
      .order('display_order', { ascending: true })
      .order('createdAt', { ascending: false });

    if (error) {
      console.warn('Error or table dynamic_activities missing:', error.message);
      return NextResponse.json([]);
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching admin dynamic activities:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, subtitle, category, content, date, time, is_active, display_order } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'عنوان النشاط مطلوب' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('dynamic_activities')
      .insert([
        {
          title: title.trim(),
          subtitle: subtitle ? String(subtitle).trim() : null,
          category: category ? String(category).trim() : 'نشاط',
          content: content ? String(content).trim() : null,
          date: date ? String(date).trim() : null,
          time: time ? String(time).trim() : null,
          is_active: is_active ?? true,
          display_order: Number(display_order) || 0,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(
      { message: 'تم إضافة القسم / النشاط بنجاح', item: data[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating dynamic activity:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إضافة النشاط. يرجى التأكد من إنشاء جدول dynamic_activities في Supabase.' },
      { status: 500 }
    );
  }
}
