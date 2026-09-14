import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Services codes (fixed) union with actual Category.slug values (dynamic —
// whatever categories exist in the Categories tab, incl. ones added later).
const SERVICE_PRODUCT_TYPES = ['MURAL', 'CERAMICS', 'CUSTOM'];

async function sanitizeProductTypes(input: unknown): Promise<string[]> {
  if (!Array.isArray(input)) return [];
  const categories = await prisma.category.findMany({ select: { slug: true } });
  const valid = new Set([...SERVICE_PRODUCT_TYPES, ...categories.map((c) => c.slug)]);
  return input.filter((t) => typeof t === 'string' && valid.has(t));
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await params;
    const body = await request.json();
    const { name_en, name_ru, name_uz, price_small, price_medium, price_large, is_active, product_types } = body;

    if (!name_uz || price_small === undefined || price_small === null) {
      return NextResponse.json(
        { success: false, error: 'name_uz and price_small are required' },
        { status: 400 }
      );
    }

    const updated = await prisma.accessory.update({
      where: { id },
      data: {
        name_en: name_en || name_uz,
        name_ru: name_ru || name_uz || name_en,
        name_uz,
        price_small: parseFloat(price_small),
        price_medium: price_medium !== undefined && price_medium !== null && price_medium !== '' ? parseFloat(price_medium) : null,
        price_large: price_large !== undefined && price_large !== null && price_large !== '' ? parseFloat(price_large) : null,
        is_active: Boolean(is_active),
        product_types: await sanitizeProductTypes(product_types),
      },
    });

    return NextResponse.json({ success: true, accessory: updated });
  } catch (error) {
    console.error('Update accessory error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update accessory' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await params;
    await prisma.accessory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete accessory error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete accessory' }, { status: 500 });
  }
}
