import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    let viewer = 'CUSTOMER';
    try {
      const body = await request.json();
      if (body.viewer) viewer = body.viewer;
    } catch {}

    const senderToMarkRead = viewer === 'CUSTOMER' ? 'ADMIN' : 'CUSTOMER';

    await prisma.serviceRequestMessage.updateMany({
      where: {
        service_request_id: id,
        sender: senderToMarkRead,
        is_read: false,
      },
      data: { is_read: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking service request messages read:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
