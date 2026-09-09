import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await context.params;
    const painting = await prisma.painting.findUnique({
      where: { id },
      include: {
        artist: true,
        category: true,
      },
    });

    if (!painting) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, painting });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await context.params;
    const body = await request.json();

    const updated = await prisma.painting.update({
      where: { id },
      data: {
        title_en: body.title_en,
        title_ru: body.title_ru,
        title_uz: body.title_uz,
        description_en: body.description_en,
        description_ru: body.description_ru,
        description_uz: body.description_uz,
        size: body.size,
        technique_en: body.technique_en,
        technique_ru: body.technique_ru,
        technique_uz: body.technique_uz,
        year: body.year ? parseInt(body.year) : undefined,
        price: body.price ? parseFloat(body.price) : undefined,
        discount_price: body.discount_price ? parseFloat(body.discount_price) : null,
        discount_starts_at: body.discount_starts_at ? new Date(body.discount_starts_at) : null,
        discount_ends_at: body.discount_ends_at ? new Date(body.discount_ends_at) : null,
        is_sold: Boolean(body.is_sold),
        sold_at: body.is_sold ? new Date() : null,
        is_featured: Boolean(body.is_featured),
        images: body.images || undefined,
        artist_id: body.artist_id,
        category_id: body.category_id,
      },
    });

    return NextResponse.json({ success: true, painting: updated });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await context.params;
    await prisma.painting.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 });
  }
}
