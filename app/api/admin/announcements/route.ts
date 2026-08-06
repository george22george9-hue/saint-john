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
    const { title, date, description } = body;

    if (!title || !date) {
      return NextResponse.json(
        { error: 'Title and Date are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('announcements')
      .insert([{ title, date, description: description || '' }])
      .select();

    if (error) throw error;
    return NextResponse.json(
      { id: data[0]?.id, message: 'Announcement created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding announcement:', error);
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}
