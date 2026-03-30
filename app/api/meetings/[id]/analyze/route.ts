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
     return NextResponse.json({ error: 'GROQ_API_KEY is missing in .env' }, { status: 500 });
  }

  try {
    // 1. Fetch the meeting and its transcript
    const meeting = await prisma.meeting.findUnique({
      where: { id: id, profileId: user.id },
    });

    if (!meeting || !meeting.transcript) {
      return NextResponse.json({ error: 'Meeting or transcript not found' }, { status: 404 });
    }

    const transcriptText = (meeting.transcript as any).data || "";

    if (!transcriptText || transcriptText.length < 10) {
      return NextResponse.json({ error: 'Transcript is too short for analysis' }, { status: 400 });
    }

    // 2. Call Groq Llama 3 for intelligent analysis
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert AI productivity assistant. 
          Your task is to analyze meeting transcripts in Vietnamese and extract valuable insights.
          Also, you must perform "Smart Speaker Diarization": identify different speakers based on context, names mentioned, and speaking styles.
          
          Respond strictly in JSON format with the following structure:
          {
            "summary": "A concise, executive summary (3-5 sentences), in Vietnamese.",
            "actionItems": [
               { "text": "A task description, in Vietnamese", "owner": "Name or null" }
            ],
            "diarizedTranscript": "The full transcript rewritten with speaker labels like 'Speaker A: [text]', 'Speaker B: [text]' or names if identified (e.g., 'Đạt: [text]')."
          }`
        },
        {
          role: "user",
          content: `Please analyze and diarize this transcript:\n\n${transcriptText}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const analysisResult = JSON.parse(chatCompletion.choices[0].message.content || "{}");

    // 3. Update the meeting record in the Database
    const updatedMeeting = await prisma.meeting.update({
      where: { id: id },
      data: {
        summary: analysisResult.summary,
        transcript: analysisResult.diarizedTranscript ? { data: analysisResult.diarizedTranscript } : meeting.transcript,
        actionItems: {
          deleteMany: {}, // Clean existing items if any
          create: analysisResult.actionItems?.map((item: any) => ({
            text: item.text,
            owner: item.owner,
            done: false
          })) || []
        }
      },
      include: { actionItems: true }
    });

    return NextResponse.json(updatedMeeting);
  } catch (error: any) {
    console.error('Lỗi khi gọi Groq AI Analysis:', error);
    return NextResponse.json({ error: 'AI Analysis failed: ' + error.message }, { status: 500 });
  }
}
