import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const VALID_PRODUCT_TYPES = ['PAINTING', 'MURAL', 'CERAMICS', 'CUSTOM'];

function sanitizeProductTypes(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input.filter((t) => VALID_PRODUCT_TYPES.includes(t));
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
    const { name_en, name_ru, name_uz, price, is_active, product_types } = body;

    const updated = await prisma.accessory.update({
      where: { id },
      data: {
        name_en,
        name_ru,
        name_uz,
        price: parseFloat(price),
        is_active: Boolean(is_active),
        product_types: sanitizeProductTypes(product_types),
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
