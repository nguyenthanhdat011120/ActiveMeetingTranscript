import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.NOTION_TOKEN || !process.env.NOTION_PAGE_ID) {
    return NextResponse.json({ 
       error: 'Thiếu cấu hình.',
       detail: 'Vui lòng thêm NOTION_TOKEN và NOTION_PAGE_ID (ID của trang mẹ) vào .env để tự động tạo Database.'
    }, { status: 400 });
  }

  const notion = new Client({ auth: process.env.NOTION_TOKEN });

  try {
    const response = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: process.env.NOTION_PAGE_ID,
      },
      title: [
        {
          type: 'text',
          text: {
            content: 'WorkFlowLoop: Meeting Logs',
          },
        },
      ],
      properties: {
        'Title': {
          title: {}, // Name property
        },
        'Date': {
          date: {},
        },
        'Status': {
          select: {
            options: [
              { name: 'Pending', color: 'gray' },
              { name: 'Done', color: 'green' },
            ],
          },
        },
      },
    });

    return NextResponse.json({ 
        message: 'Tạo Database thành công!',
        database_id: (response as any).id,
        url: (response as any).url
    });

  } catch (error: any) {
    console.error('Lỗi khi tạo Database Notion:', error);
    return NextResponse.json({ error: 'Tạo thất bại: ' + (error.message || 'Lỗi Notion API') }, { status: 500 });
  }
}
