import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { createClient } from '@/lib/supabase/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { transcript } = await request.json();

  if (!transcript) {
    return NextResponse.json({ error: 'Missing transcript' }, { status: 400 });
  }

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert AI Script Editor. 
          The user has uploaded a raw meeting transcript that was spliced into chunks and re-assembled. 
          Your task:
          1. FIX SEAMS: Some words might be repeated at the boundaries of fragments. Remove redundant text.
          2. DIARIZATION: Identify speakers based on context and conversational flow.
          3. FORMAT: Output the result as a professional script. 
          Example: 
          [Speaker A]: Text...
          [Speaker B]: Text...
          
          ONLY output the synthesized script text. Nothing else.`
        },
        {
          role: "user",
          content: `Synthesize this raw meeting transcript: \n\n ${transcript}`
        }
      ],
      temperature: 0.2,
      max_tokens: 8000,
    });

    return NextResponse.json({ 
        script: response.choices[0]?.message?.content || "No synthesis generated.",
    });
  } catch (error: any) {
    console.error('Synthesis Error:', error);
    return NextResponse.json({ error: 'Failed to synthesize script: ' + error.message }, { status: 500 });
  }
}
