import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('artqala_user');

    if (!userCookie || !userCookie.value) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const session = JSON.parse(userCookie.value);

    // Fetch inquiries by user_id OR guest_email
    const inquiries = await prisma.inquiry.findMany({
      where: {
        OR: [{ user_id: session.id }, { guest_email: session.email }],
      },
      include: {
        painting: {
          select: {
            id: true,
            title_en: true,
            title_ru: true,
            title_uz: true,
            price: true,
            images: true,
            artist: { select: { name: true } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // Fetch service requests
    const serviceRequests = await prisma.serviceRequest.findMany({
      where: {
        OR: [{ user_id: session.id }, { guest_contact: { contains: session.email } }],
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({
      success: true,
      inquiries,
      serviceRequests,
    });
  } catch (error) {
    console.error('Fetch user inquiries error:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
