import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: activities, error } = await supabase
      .from('dynamic_activities')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('createdAt', { ascending: false });

    if (error) {
      // If table doesn't exist yet, return empty array gracefully
      console.warn('Error fetching dynamic activities:', error.message);
      return NextResponse.json([]);
    }

    return NextResponse.json(activities || [], {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching public dynamic activities:', error);
    return NextResponse.json([]);
  }
}
