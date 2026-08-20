import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { supabase as supabasePublic } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth';

// Use privileged server client (supabaseAdmin) to bypass RLS securely on admin server API
const dbClient = supabaseAdmin || supabasePublic;

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: inquiries, error } = await dbClient
      .from('inquiries')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('[GET /api/admin/inquiries Error]:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      return NextResponse.json(
        {
          error: 'فشل في جلب رسائل واستفسارات الشباب من قاعدة البيانات',
          details: error.message,
          code: error.code,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(inquiries || []);
  } catch (error: any) {
    console.error('[GET /api/admin/inquiries Exception]:', error);
    return NextResponse.json(
      {
        error: 'حدث خطأ غير متوقع أثناء جلب الرسائل',
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
