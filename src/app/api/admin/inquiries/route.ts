import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/admin/inquiries — used by the admin panel to poll for new
// inquiries/messages without requiring a manual page reload.
export async function GET() {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const inquiries = await prisma.inquiry.findMany({
      include: {
        painting: {
          select: {
            id: true,
            title_en: true,
            price: true,
            discount_price: true,
            images: true,
            is_sold: true,
          },
        },
        messages: {
          orderBy: { created_at: 'asc' },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    console.error('Error fetching admin inquiries:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
