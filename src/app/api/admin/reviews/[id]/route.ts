import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await context.params;
    const body = await request.json();

    const { is_approved } = body;
    if (typeof is_approved !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'is_approved boolean is required' },
        { status: 400 }
      );
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { is_approved },
      include: {
        painting: { select: { id: true, title_en: true } },
      },
    });

    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    console.error('Update review approval error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await context.params;

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
