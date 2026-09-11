import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const isAdmin = session.role === 'ADMIN';

    if (!isAdmin) {
      const sr = await prisma.serviceRequest.findUnique({
        where: { id },
        select: { user_id: true, guest_contact: true },
      });
      const owns =
        sr &&
        (sr.user_id === session.id ||
          sr.guest_contact?.toLowerCase().includes(session.email.toLowerCase()));
      if (!owns) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
    }

    // Never trust a client-supplied viewer — derive it from the verified session.
    const senderToMarkRead = isAdmin ? 'CUSTOMER' : 'ADMIN';

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
