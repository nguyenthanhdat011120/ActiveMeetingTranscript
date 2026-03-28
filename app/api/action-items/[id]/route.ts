import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { done } = body;

    const actionItem = await prisma.actionItem.update({
      where: { id: id },
      data: { done }
    });

    return NextResponse.json(actionItem);
  } catch (error) {
    console.error('Error updating action item:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
