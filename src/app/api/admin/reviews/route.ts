import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const reviews = await prisma.review.findMany({
      include: {
        painting: {
          select: {
            id: true,
            title_en: true,
            title_ru: true,
            title_uz: true,
            images: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const pendingCount = reviews.filter((r) => !r.is_approved).length;
    const approvedCount = reviews.filter((r) => r.is_approved).length;

    return NextResponse.json({
      success: true,
      reviews,
      pendingCount,
      approvedCount,
    });
  } catch (error) {
    console.error('Admin fetch reviews error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
