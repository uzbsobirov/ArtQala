import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Public, read-only: active accessories a customer can optionally add to an
// inquiry, with the category ids they apply to (empty categories = applies
// to every category).
export async function GET() {
  try {
    const accessories = await prisma.accessory.findMany({
      where: { is_active: true },
      select: {
        id: true,
        name_en: true,
        name_ru: true,
        name_uz: true,
        price: true,
        categories: { select: { id: true } },
      },
      orderBy: { created_at: 'asc' },
    });

    return NextResponse.json({ success: true, accessories });
  } catch (error) {
    console.error('Fetch public accessories error:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
