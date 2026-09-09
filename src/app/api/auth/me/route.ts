import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || !session.id) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        country: true,
        role: true,
        email_verified: true,
        must_change_password: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({ user: null });
  }
}
