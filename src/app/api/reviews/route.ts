import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { is_approved: true },
      include: {
        painting: { select: { id: true, title_en: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { author_name, rating, text, painting_id } = body;

    if (!author_name || !text) {
      return NextResponse.json(
        { success: false, error: 'Author name and review text required' },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        author_name,
        rating: parseInt(rating) || 5,
        text,
        painting_id: painting_id || null,
        is_approved: true,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Review create error:', error);
    return NextResponse.json({ success: false, error: 'Failed to post review' }, { status: 500 });
  }
}
