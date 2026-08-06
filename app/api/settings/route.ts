import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: settingsRows, error } = await supabase
      .from('settings')
      .select('*');

    if (error) throw error;

    const settings: Record<string, string> = {};
    if (settingsRows) {
      settingsRows.forEach((row: { key: string; value: string }) => {
        settings[row.key] = row.value;
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Database error while fetching settings' },
      { status: 500 }
    );
  }
}
