import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.branch.update({
      where: { id },
      data: {
        name_uz: body.name_uz,
        name_en: body.name_en,
        name_ru: body.name_ru,
        address: body.address,
        location_map: body.location_map,
        phone: body.phone || null,
        working_hours: body.working_hours || null,
        order: typeof body.order === 'number' ? body.order : undefined,
      },
    });

    return NextResponse.json({ success: true, branch: updated });
  } catch (error) {
    console.error('Update branch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update branch' }, { status: 500 });
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
    await prisma.branch.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete branch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete branch' }, { status: 500 });
  }
}
