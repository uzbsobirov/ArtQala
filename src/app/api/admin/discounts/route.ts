import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const discounts = await prisma.discount.findMany({
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json({ success: true, discounts });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scope, target_id, percent, starts_at, ends_at, is_active } = body;

    const discount = await prisma.discount.create({
      data: {
        scope, // SITE, CATEGORY, ARTIST, PAINTING
        target_id: target_id || null,
        percent: parseFloat(percent) || 0,
        starts_at: starts_at ? new Date(starts_at) : null,
        ends_at: ends_at ? new Date(ends_at) : null,
        is_active: is_active !== undefined ? Boolean(is_active) : true,
      },
    });

    // If scope is PAINTING, calculate discount_price directly on painting
    if (scope === 'PAINTING' && target_id) {
      const painting = await prisma.painting.findUnique({ where: { id: target_id } });
      if (painting) {
        const discountPrice = Math.round(painting.price * (1 - (parseFloat(percent) || 0) / 100));
        await prisma.painting.update({
          where: { id: target_id },
          data: {
            discount_price: discountPrice,
            discount_starts_at: starts_at ? new Date(starts_at) : null,
            discount_ends_at: ends_at ? new Date(ends_at) : null,
          },
        });
      }
    }

    return NextResponse.json({ success: true, discount });
  } catch (error) {
    console.error('Discount creation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create discount' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    await prisma.discount.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Delete error' }, { status: 500 });
  }
}
