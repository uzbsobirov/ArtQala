import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateEmail, validatePhoneOrTelegram } from '@/lib/validation';
import { checkRateLimit, recordFailedAttempt, getClientIp } from '@/lib/rateLimit';
import { getServerSession } from '@/lib/auth';

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
    const { painting_id, guest_name, guest_email, guest_phone, message, selected_accessories } = body;

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

    const phoneValidation = validatePhoneOrTelegram(guest_phone);
    if (!phoneValidation.isValid) {
      return NextResponse.json(
        { success: false, error: phoneValidation.error },
        { status: 400 }
      );
    }

    // Never trust a client-supplied user_id — attach to the verified session
    // if the caller is signed in, otherwise fall back to matching by email.
    const session = await getServerSession();
    let effectiveUserId = session?.id;
    if (!effectiveUserId) {
      const existingUser = await prisma.user.findUnique({
        where: { email: guest_email.trim().toLowerCase() },
      });
      if (existingUser) {
        effectiveUserId = existingUser.id;
      }
    }

    // Re-fetch accessory name/price from the DB rather than trusting the
    // client — only the ids the customer checked are honored.
    let accessoriesSnapshot: string | null = null;
    if (Array.isArray(selected_accessories) && selected_accessories.length > 0) {
      const ids = selected_accessories.map((a: { id: string }) => a?.id).filter(Boolean);
      const found = await prisma.accessory.findMany({
        where: { id: { in: ids }, is_active: true },
        select: { id: true, name_en: true, name_ru: true, name_uz: true, price: true },
      });
      if (found.length > 0) accessoriesSnapshot = JSON.stringify(found);
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        painting_id,
        guest_name: guest_name.trim(),
        guest_email: guest_email.trim().toLowerCase(),
        guest_phone: guest_phone.trim(),
        message: message.trim(),
        user_id: effectiveUserId || null,
        selected_accessories: accessoriesSnapshot,
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
