import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, recordFailedAttempt, getClientIp } from '@/lib/rateLimit';
import { getServerSession } from '@/lib/auth';

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
    const { guest_name, guest_contact, service_type, description, selected_accessories } = body;

    if (!guest_name || !guest_contact || !service_type || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Never trust a client-supplied user_id — attach to the verified session
    // if the caller is signed in, otherwise it stays a guest request.
    const session = await getServerSession();

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

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        guest_name,
        guest_contact,
        service_type,
        description,
        user_id: session?.id || null,
        selected_accessories: accessoriesSnapshot,
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
