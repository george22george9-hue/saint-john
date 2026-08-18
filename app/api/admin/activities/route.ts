import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { supabase as supabasePublic } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth';

// Use supabaseAdmin if service role is configured, otherwise fallback to standard client
const client = supabaseAdmin || supabasePublic;

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await client
      .from('dynamic_activities')
      .select('*')
      .order('display_order', { ascending: true })
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('[Admin Dynamic Activities GET Error]:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return NextResponse.json([]);
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
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

    const { data, error } = await client
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

    if (error) {
      console.error('[Admin Dynamic Activities POST Error]:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      let userMsg = 'حدث خطأ أثناء إضافة النشاط في قاعدة البيانات.';
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        userMsg = 'لم يتم إنشاء جدول dynamic_activities في Supabase بعد. يرجى تشغيل ملف supabase_migration.sql في SQL Editor في Supabase.';
      } else if (error.code === '42703') {
        userMsg = 'توجد أعمدة مفقودة في جدول dynamic_activities في Supabase.';
      } else if (error.code === '42501' || error.message.includes('row-level security')) {
        userMsg = 'سياسة الحماية (RLS) تمنع الإضافة. يرجى التأكد من تشغيل ملف supabase_migration.sql في Supabase SQL Editor.';
      }

      return NextResponse.json(
        {
          error: userMsg,
          code: error.code,
          details: error.message,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'تم إضافة القسم / النشاط بنجاح', item: data[0] },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Unhandled Error creating dynamic activity:', error);
    return NextResponse.json(
      {
        error: 'حدث خطأ في الخادم أثناء إضافة النشاط',
        details: error?.message || 'خطأ غير معروف',
      },
      { status: 500 }
    );
  }
}
