import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { friday_time, sunday_schedule } = body;

    if (friday_time !== undefined) {
      await supabase
        .from('settings')
        .update({ value: friday_time })
        .eq('key', 'friday_time');
    }
    if (sunday_schedule !== undefined) {
      await supabase
        .from('settings')
        .update({ value: sunday_schedule })
        .eq('key', 'sunday_schedule');
    }

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
