import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, recordFailedAttempt, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimitKey = `service:${ip}`;
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
    const { guest_name, guest_contact, service_type, description, user_id } = body;

    if (!guest_name || !guest_contact || !service_type || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        guest_name,
        guest_contact,
        service_type,
        description,
        user_id: user_id || null,
        status: 'NEW',
        messages: {
          create: {
            sender: 'CUSTOMER',
            message: description.trim(),
            is_read: false,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json({ success: true, serviceRequest });
  } catch (error) {
    console.error('API service request error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service request' },
      { status: 500 }
    );
  }
}
