import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateEmail, validatePhoneOrTelegram } from '@/lib/validation';
import { checkRateLimit, recordFailedAttempt, getClientIp } from '@/lib/rateLimit';

const MAX_ITEMS = 20;

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
    const { painting_ids, guest_name, guest_email, guest_phone, message, user_id } = body;

    if (!Array.isArray(painting_ids) || painting_ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one painting is required' },
        { status: 400 }
      );
    }

    if (painting_ids.length > MAX_ITEMS) {
      return NextResponse.json(
        { success: false, error: `You can inquire about up to ${MAX_ITEMS} paintings at once` },
        { status: 400 }
      );
    }

    if (!guest_name || !guest_email || !message) {
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

    const phoneValidation = validatePhoneOrTelegram(guest_phone);
    if (!phoneValidation.isValid) {
      return NextResponse.json(
        { success: false, error: phoneValidation.error },
        { status: 400 }
      );
    }

    const normalizedEmail = guest_email.trim().toLowerCase();

    let effectiveUserId = user_id;
    if (!effectiveUserId) {
      const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existingUser) effectiveUserId = existingUser.id;
    }

    const validPaintings = await prisma.painting.findMany({
      where: { id: { in: painting_ids } },
      select: { id: true },
    });
    const validIds = validPaintings.map((p) => p.id);

    if (validIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid paintings found' },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();
    const inquiries = await prisma.$transaction(
      validIds.map((paintingId) =>
        prisma.inquiry.create({
          data: {
            painting_id: paintingId,
            guest_name: guest_name.trim(),
            guest_email: normalizedEmail,
            guest_phone: guest_phone.trim(),
            message: trimmedMessage,
            user_id: effectiveUserId || null,
            status: 'NEW',
            messages: {
              create: {
                sender: 'CUSTOMER',
                message: trimmedMessage,
                is_read: false,
              },
            },
          },
        })
      )
    );

    return NextResponse.json({ success: true, count: inquiries.length });
  } catch (error) {
    console.error('Bulk inquiry error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create inquiries' },
      { status: 500 }
    );
  }
}
