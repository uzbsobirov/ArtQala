import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing painting ID' }, { status: 400 });
    }

    // Increment views_count and record timestamped view in transaction
    const [, view] = await prisma.$transaction([
      prisma.painting.update({
        where: { id },
        data: { views_count: { increment: 1 } },
      }),
      prisma.paintingView.create({
        data: { painting_id: id },
      }),
    ]);

    return NextResponse.json({ success: true, viewId: view.id });
  } catch (error) {
    console.error('Error tracking painting view:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
