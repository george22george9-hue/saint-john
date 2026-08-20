import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return NextResponse.json(announcements || [], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Database error while fetching announcements' },
      { status: 500 }
    );
  }
}

