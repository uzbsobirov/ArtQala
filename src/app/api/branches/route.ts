import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
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
