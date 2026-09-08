import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        subject: subject?.trim() || null,
        message: message.trim(),
      },
    });

    return NextResponse.json({ success: true, message: contactMessage });
  } catch (error) {
    console.error('Contact message error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('artqala_user')?.value;

    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(userCookie);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Fetch contact messages error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages.' },
      { status: 500 }
    );
  }
}
