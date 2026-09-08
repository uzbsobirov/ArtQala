import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('artqala_user');

    if (!userCookie || !userCookie.value) {
      return NextResponse.json({ wishlist: [] });
    }

    const session = JSON.parse(userCookie.value);
    const items = await prisma.wishlistItem.findMany({
      where: { user_id: session.id },
      include: {
        painting: {
          include: {
            artist: true,
            category: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({
      success: true,
      wishlist: items.map((i) => i.painting),
    });
  } catch (error) {
    console.error('Wishlist fetch error:', error);
    return NextResponse.json({ wishlist: [] });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('artqala_user');

    if (!userCookie || !userCookie.value) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const session = JSON.parse(userCookie.value);
    const { paintingIds } = await request.json();

    if (Array.isArray(paintingIds)) {
      for (const pId of paintingIds) {
        await prisma.wishlistItem.upsert({
          where: {
            user_id_painting_id: {
              user_id: session.id,
              painting_id: pId,
            },
          },
          create: {
            user_id: session.id,
            painting_id: pId,
          },
          update: {},
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Wishlist synced' });
  } catch (error) {
    console.error('Wishlist sync error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
