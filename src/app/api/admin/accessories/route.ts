import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const accessories = await prisma.accessory.findMany({
      include: { categories: { select: { id: true, name_en: true, name_ru: true, name_uz: true } } },
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json({ success: true, accessories });
  } catch (error) {
    console.error('Fetch accessories error:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await request.json();
    const { name_en, name_ru, name_uz, price, is_active, category_ids } = body;

    if (!name_en || !name_uz || price === undefined || price === null) {
      return NextResponse.json(
        { success: false, error: 'name_en, name_uz and price are required' },
        { status: 400 }
      );
    }

    const accessory = await prisma.accessory.create({
      data: {
        name_en,
        name_ru: name_ru || name_en,
        name_uz,
        price: parseFloat(price),
        is_active: is_active !== undefined ? Boolean(is_active) : true,
        categories: {
          connect: Array.isArray(category_ids) ? category_ids.map((id: string) => ({ id })) : [],
        },
      },
      include: { categories: true },
    });

    return NextResponse.json({ success: true, accessory });
  } catch (error) {
    console.error('Create accessory error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create accessory' }, { status: 500 });
  }
}
