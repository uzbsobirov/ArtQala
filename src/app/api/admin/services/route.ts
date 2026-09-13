import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/admin/services — used by the admin panel to poll for new
// service requests/messages without requiring a manual page reload.
export async function GET() {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const serviceRequests = await prisma.serviceRequest.findMany({
      include: {
        messages: {
          orderBy: { created_at: 'asc' },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ success: true, serviceRequests });
  } catch (error) {
    console.error('Error fetching admin service requests:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
