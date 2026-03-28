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
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Không nhận được file âm thanh' }, { status: 400 });
    }

    // Transcription using Groq (Sử dụng mô hình Whisper Large V3 miễn phí)
    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3",
      language: "vi", // Tối ưu cho tiếng Việt
      response_format: "json",
    });

    return NextResponse.json({ 
      text: transcription.text,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Lỗi khi gọi Groq Transcription:', error);
    return NextResponse.json({ error: 'Transcription thất bại: ' + error.message }, { status: 500 });
  }
}
