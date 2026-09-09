import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await params;

    if (id === auth.user.id) {
      return NextResponse.json(
        { success: false, error: "O'zingizni admin ro'yxatidan o'chira olmaysiz" },
        { status: 400 }
      );
    }

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target || target.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Admin topilmadi' }, { status: 404 });
    }

    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
    if (adminCount <= 1) {
      return NextResponse.json(
        { success: false, error: "Kamida bitta admin hisobi qolishi shart" },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete staff error:', error);
    return NextResponse.json({ success: false, error: "O'chirishda xatolik yuz berdi" }, { status: 500 });
  }
}
