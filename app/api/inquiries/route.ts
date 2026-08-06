import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, hymnRequest, message } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Message field is required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('inquiries')
      .insert([
        {
          name: name ? String(name).trim() : null,
          hymnRequest: hymnRequest ? String(hymnRequest).trim() : null,
          message: String(message).trim(),
        },
      ])
      .select();

    if (error) throw error;
    return NextResponse.json(
      { id: data[0]?.id, message: 'Inquiry submitted successfully!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    return NextResponse.json(
      { error: 'Database error while submitting inquiry' },
      { status: 500 }
    );
  }
}
