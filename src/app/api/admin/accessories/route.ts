import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Services codes (fixed) union with actual Category.slug values (dynamic —
// whatever categories exist in the Categories tab, incl. ones added later).
const SERVICE_PRODUCT_TYPES = ['MURAL', 'CERAMICS', 'CUSTOM'];

async function sanitizeProductTypes(input: unknown): Promise<string[]> {
  if (!Array.isArray(input)) return [];
  // Only top-level categories are physical product types — sub-categories
  // (Nature, Portraits, ...) resolve to their parent before ever reaching here.
  const categories = await prisma.category.findMany({ where: { parent_id: null }, select: { slug: true } });
  const valid = new Set([...SERVICE_PRODUCT_TYPES, ...categories.map((c) => c.slug)]);
  return input.filter((t) => typeof t === 'string' && valid.has(t));
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const accessories = await prisma.accessory.findMany({
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
    const { name_en, name_ru, name_uz, price_small, price_medium, price_large, is_active, product_types } = body;

    if (!name_uz || price_small === undefined || price_small === null) {
      return NextResponse.json(
        { success: false, error: 'name_uz and price_small are required' },
        { status: 400 }
      );
    }

    const accessory = await prisma.accessory.create({
      data: {
        name_en: name_en || name_uz,
        // Fall back to UZ (not EN) — leaving RU blank should never surface
        // English text where a Russian name is expected.
        name_ru: name_ru || name_uz || name_en,
        name_uz,
        price_small: parseFloat(price_small),
        price_medium: price_medium !== undefined && price_medium !== null && price_medium !== '' ? parseFloat(price_medium) : null,
        price_large: price_large !== undefined && price_large !== null && price_large !== '' ? parseFloat(price_large) : null,
        is_active: is_active !== undefined ? Boolean(is_active) : true,
        product_types: await sanitizeProductTypes(product_types),
      },
    });

    return NextResponse.json({ success: true, accessory });
  } catch (error) {
    console.error('Create accessory error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create accessory' }, { status: 500 });
  }
}
