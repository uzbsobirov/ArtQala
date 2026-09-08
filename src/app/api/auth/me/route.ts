import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('artqala_user');

    if (!userCookie || !userCookie.value) {
      return NextResponse.json({ user: null });
    }

    const session = JSON.parse(userCookie.value);
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        country: true,
        role: true,
        email_verified: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null });
  }
}
