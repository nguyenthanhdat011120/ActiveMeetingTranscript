import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { meetingId } = await request.json();

  // 1. Lấy Profile để lấy Slack Webhook URL
  const profile = await prisma.profile.findUnique({
    where: { id: user.id }
  });

  const webhookUrl = (profile as any)?.slackWebhookUrl || process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json({ 
       error: 'Chưa cấu hình Slack.',
       detail: 'Vui lòng truy cập trang Cấu hình (Settings) để thiết lập Slack Webhook URL.'
    }, { status: 400 });
  }

  try {
    // 2. Lấy dữ liệu họp
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId, profileId: user.id },
      include: { actionItems: true }
    });

    if (!meeting) return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });

    // 3. Định dạng Block Kit cho Slack
    const slackMessage = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `🌪️ Executive Summary: ${meeting.title}`,
            emoji: true
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Date:* ${meeting.date.toLocaleDateString()} | *Duration:* ${meeting.duration || 'N/A'}`
          }
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Summary*\n${meeting.summary || 'No summary generated yet.'}`
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Action Items:*"
          }
        },
        ...meeting.actionItems.map(item => ({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${item.done ? '✅' : '🔜'} *${item.text}* ${item.owner ? `(Owner: <@${item.owner}>)` : ''}`
          }
        })),
        {
          type: "divider"
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Sent via *ACTIVE MEETING TRANSCRIPT* Platform`
            }
          ]
        }
      ]
    };

    // 4. Gửi tới Slack Webhook
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackMessage)
    });

    if (res.ok) {
        return NextResponse.json({ message: 'Synced to Slack successfully!' });
    } else {
        const err = await res.text();
        throw new Error(err);
    }

  } catch (error: any) {
    console.error('Slack sync error:', error);
    return NextResponse.json({ error: 'Failed to sync to Slack: ' + error.message }, { status: 500 });
  }
}
