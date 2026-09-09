import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateEmail } from '@/lib/validation';
import { checkRateLimit, recordFailedAttempt, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimitKey = `inquiry:${ip}`;
    const rateCheck = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      const minutesLeft = Math.ceil(rateCheck.retryAfterSeconds / 60);
      return NextResponse.json(
        {
          success: false,
          error: `Juda ko'p so'rov yuborildi. Iltimos, ${minutesLeft} daqiqadan so'ng qayta urinib ko'ring.`,
          retryAfterSeconds: rateCheck.retryAfterSeconds,
        },
        { status: 429 }
      );
    }
    recordFailedAttempt(rateLimitKey);

    const body = await request.json();
    const { painting_id, guest_name, guest_email, guest_phone, message, user_id } = body;

    if (!painting_id || !guest_name || !guest_email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailValidation = validateEmail(guest_email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { success: false, error: emailValidation.error },
        { status: 400 }
      );
    }

    let effectiveUserId = user_id;
    if (!effectiveUserId) {
      const existingUser = await prisma.user.findUnique({
        where: { email: guest_email.trim().toLowerCase() },
      });
      if (existingUser) {
        effectiveUserId = existingUser.id;
      }
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        painting_id,
        guest_name: guest_name.trim(),
        guest_email: guest_email.trim().toLowerCase(),
        guest_phone: guest_phone || null,
        message: message.trim(),
        user_id: effectiveUserId || null,
        status: 'NEW',
        messages: {
          create: {
            sender: 'CUSTOMER',
            message: message.trim(),
            is_read: false,
          },
        },
      },
      include: {
        messages: true,
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
