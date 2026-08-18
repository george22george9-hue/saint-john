import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { data: activities, error } = await supabase
      .from('dynamic_activities')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('createdAt', { ascending: true });

    if (error) {
      console.warn('Error fetching dynamic activities:', error.message);
      return NextResponse.json([], {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      });
    }

    return NextResponse.json(activities || [], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching public dynamic activities:', error);
    return NextResponse.json([], { status: 500 });
  }
}
