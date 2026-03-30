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

  // Check if API key is configured
  if (!process.env.GROQ_API_KEY) {
     console.warn('GROQ_API_KEY không có trong .env. Sử dụng dữ liệu giả để chạy thử giao diện...');
     return NextResponse.json({ 
       text: "Đây là dữ liệu giả (MOCK) vì bạn chưa thêm GROQ_API_KEY. Hãy lấy Key miễn phí tại console.groq.com để nhận kết quả chính xác 100%.",
       timestamp: new Date().toISOString()
    });
  }

  try {
    const contentType = request.headers.get('content-type') || "";
    let file: File | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      file = formData.get('file') as File;
    } else if (contentType.includes('application/octet-stream')) {
      // Handle raw binary data for stability
      const buffer = await request.arrayBuffer();
      const fileName = request.headers.get('x-file-name') || 'audio.wav';
      file = new File([buffer], fileName, { type: 'audio/wav' });
    } else {
       console.error('Unsupported Content-Type:', contentType);
       return NextResponse.json({ error: 'Unsupported Content-Type. Use multipart/form-data or application/octet-stream.' }, { status: 400 });
    }

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'Không nhận được dữ liệu âm thanh hợp lệ' }, { status: 400 });
    }

    // Check size limit (25MB)
    if (file.size > 25 * 1024 * 1024) {
       return NextResponse.json({ 
          error: 'Fragment too large',
          detail: `File size ${Math.round(file.size / 1024 / 1024)}MB exceeds the 25MB limit. Please use the Slicer tool to downsample or cutting fragments.`
       }, { status: 413 });
    }

    console.log(`📡 Sending to AI [${file.name}] - ${Math.round(file.size / 1024)}KB`);

    // Transcription using Groq (Sử dụng mô hình Whisper Large V3 miễn phí)
    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3",
      language: "vi", 
      response_format: "json",
    });

    return NextResponse.json({ 
      text: transcription.text,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Groq AI Error Details:', error);
    
    // Check if it's an API error from Groq
    const groqErrorMsg = error?.error?.message || error?.message || "Internal server error during transcription";
    
    return NextResponse.json({ 
      error: 'Transcription failed',
      detail: groqErrorMsg,
      code: error?.status || 500
    }, { status: 500 });
  }
}
