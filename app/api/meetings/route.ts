import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const meetings = await prisma.meeting.findMany({
      where: { profileId: user.id },
      orderBy: { date: 'desc' },
      include: { actionItems: true }
    });
    return NextResponse.json(meetings);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, duration, transcript, summary, actionItems } = body;

    // Ensure Profile exists (Fix for potential missing profile after signup)
    await prisma.profile.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email || '',
        fullName: user.user_metadata?.full_name || 'User',
      }
    });

    const meeting = await prisma.meeting.create({
      data: {
        profileId: user.id,
        title: title || 'New Meeting',
        duration,
        transcript,
        summary,
        actionItems: {
          create: actionItems?.map((item: any) => ({
            text: item.text,
            owner: item.owner,
            done: item.done || false
          })) || []
        }
      },
      include: { actionItems: true }
    });

    return NextResponse.json(meeting);
  } catch (error: any) {
    console.error('Error creating meeting in Database:', error);
    // Return more specific error if available
    return NextResponse.json({ 
      error: 'Failed to create meeting', 
      details: error.message,
      code: error.code 
    }, { status: 500 });
  }
}
