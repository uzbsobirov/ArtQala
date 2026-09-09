import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await context.params;
    const body = await request.json();

    const updated = await prisma.serviceRequest.update({
      where: { id },
      data: {
        status: body.status,
        admin_notes: body.admin_notes,
      },
    });

    return NextResponse.json({ success: true, serviceRequest: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update service request' }, { status: 500 });
  }
}
