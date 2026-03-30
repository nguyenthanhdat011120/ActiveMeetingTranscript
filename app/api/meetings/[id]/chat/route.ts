import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.GROQ_API_KEY) {
     return NextResponse.json({ error: 'GROQ_API_KEY missing' }, { status: 500 });
  }

  try {
    const { message, history } = await request.json();

    // 1. Fetch transcript from DB for context
    const meeting = await prisma.meeting.findUnique({
      where: { id: id, profileId: user.id },
    });

    if (!meeting || !meeting.transcript) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    const transcriptText = (meeting.transcript as any).data || "";

    // 2. Chat with Groq Llama 3 using transcript as context
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI Analyst for the "Active Meeting Transcript" app. 
          Your goal is to answer questions about a specific meeting based ONLY on the transcript provided.
          Be concise, accurate, and professional. Use Vietnamese for your responses.
          If the answer is not in the transcript, politely say so.
          
          TRANSCRIPT CONTEXT:
          ${transcriptText}`
        },
        ...history.map((h: any) => ({
          role: h.role,
          content: h.content
        })),
        {
          role: "user",
          content: message
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
    });

    const aiResponse = chatCompletion.choices[0].message.content;

    return NextResponse.json({ 
       role: 'assistant',
       content: aiResponse 
    });
    
  } catch (error: any) {
    console.error('Groq Chat Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
