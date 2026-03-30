import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { meetingId } = await request.json();

  // 1. Lấy Profile người dùng từ DB để lấy cài đặt riêng
  const profile = await prisma.profile.findUnique({
    where: { id: user.id }
  });

  const notionToken = (profile as any)?.notionToken || process.env.NOTION_TOKEN;
  const notionPageId = (profile as any)?.notionPageId || process.env.NOTION_PAGE_ID;

  if (!notionToken || !notionPageId) {
    return NextResponse.json({ 
       error: 'Chưa cấu hình Notion.',
       detail: 'Vui lòng truy cập trang Cấu hình (Settings) để thiết lập Notion Token và Page ID.'
    }, { status: 400 });
  }

  const notion = new Client({ auth: notionToken });

  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId, profileId: user.id },
      include: { actionItems: true }
    });

    if (!meeting) {
      return NextResponse.json({ error: 'Không tìm thấy cuộc họp' }, { status: 404 });
    }

    // 2. Tạo Trang con độc lập (Sub-page) trực tiếp dưới Page mẹ
    const response = await notion.pages.create({
      parent: { 
        type: 'page_id',
        page_id: notionPageId 
      },
      properties: {
        'title': {
          title: [
            {
              text: {
                content: `Report: ${meeting.title} (${new Date(meeting.date).toLocaleDateString()})`,
              },
            },
          ],
        },
      },
      children: [
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ type: 'text', text: { content: 'Executive Summary' } }],
          },
        } as any,
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: meeting.summary || "No summary provided." } }],
          },
        } as any,
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Action Items' } }],
          },
        } as any,
        ...meeting.actionItems.map((item) => ({
          object: 'block',
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text' as const, text: { content: `${item.text} (${item.owner || "No owner"})` } }],
            checked: item.done,
          },
        } as any)),
      ],
    });

    return NextResponse.json({ 
        message: 'Đồng bộ Notion thành công!',
        url: (response as any).url 
    });

  } catch (error: any) {
    console.error('Lỗi khi đồng bộ Notion:', error);
    return NextResponse.json({ error: 'Đồng bộ thất bại: ' + (error.message || 'Lỗi Notion API') }, { status: 500 });
  }
}
