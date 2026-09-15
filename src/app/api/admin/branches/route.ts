import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const branches = await prisma.branch.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, branches });
  } catch (error) {
    console.error('Fetch branches error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch branches' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await request.json();
    const { name_uz, name_en, name_ru, address, location_map, phone, working_hours, order } = body;

    if (!name_uz && !name_en) {
      return NextResponse.json({ success: false, error: 'Filial nomi kiritilishi shart' }, { status: 400 });
    }
    if (!address) {
      return NextResponse.json({ success: false, error: 'Manzil kiritilishi shart' }, { status: 400 });
    }

    const branch = await prisma.branch.create({
      data: {
        name_uz: name_uz || name_en,
        name_en: name_en || name_uz,
        name_ru: name_ru || name_uz,
        address,
        location_map: location_map || '',
        phone: phone || null,
        working_hours: working_hours || null,
        order: typeof order === 'number' ? order : 0,
      },
    });

    return NextResponse.json({ success: true, branch });
  } catch (error) {
    console.error('Create branch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create branch' }, { status: 500 });
  }
}
