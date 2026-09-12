import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Public, read-only: active accessories a customer can optionally add to an
// inquiry or service request. product_types: [] means it applies everywhere.
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
        product_types: true,
      },
      orderBy: { created_at: 'asc' },
    });

    return NextResponse.json({ success: true, accessories });
  } catch (error) {
    console.error('Fetch public accessories error:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
