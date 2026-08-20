import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { supabase as supabasePublic } from '@/lib/supabase';

// Use privileged server client (supabaseAdmin) when available to bypass RLS securely on server, or fallback to public client
const dbClient = supabaseAdmin || supabasePublic;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, hymnRequest, message } = body;

    // Validate required message field
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'حقل السؤال أو الاقتراح مطلوب ولا يمكن أن يكون فارغاً.' },
        { status: 400 }
      );
    }

    const payload = {
      name: name && String(name).trim() ? String(name).trim() : null,
      hymnRequest: hymnRequest && String(hymnRequest).trim() ? String(hymnRequest).trim() : null,
      message: String(message).trim(),
      status: 'تحت المراجعة',
    };

    // Attempt insertion with .select()
    let { data, error } = await dbClient
      .from('inquiries')
      .insert([payload])
      .select();

    // Fallback: If .select() fails due to RLS 42501 (missing SELECT policy for anon role), retry plain insert
    if (error && error.code === '42501') {
      console.warn('[POST /api/inquiries]: RLS 42501 on .select(), retrying plain insert...');
      const plainInsertRes = await dbClient.from('inquiries').insert([payload]);
      if (!plainInsertRes.error) {
        error = null;
        data = [{ message: 'Submitted successfully' }] as any;
      } else {
        error = plainInsertRes.error;
      }
    }

    if (error) {
      console.error('[POST /api/inquiries Error]:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      return NextResponse.json(
        {
          error: 'عذراً، حدث خطأ أثناء إرسال الرسالة في قاعدة البيانات.',
          details: error.message,
          code: error.code,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        id: data && data[0] ? data[0].id : undefined,
        message: 'تم إرسال رسالتك بنجاح!',
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[POST /api/inquiries Exception]:', err);
    return NextResponse.json(
      {
        error: 'حدث خطأ غير متوقع أثناء معالجة الطلب.',
        details: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
