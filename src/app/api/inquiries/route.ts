import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { painting_id, guest_name, guest_email, guest_phone, message, user_id } = body;

    if (!painting_id || !guest_name || !guest_email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        painting_id,
        guest_name,
        guest_email,
        guest_phone: guest_phone || null,
        message,
        user_id: user_id || null,
        status: 'NEW',
      },
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error('API inquiry error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create inquiry' },
      { status: 500 }
    );
  }
}
