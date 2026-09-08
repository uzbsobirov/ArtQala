import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    let path = '/';
    try {
      const body = await request.json();
      if (body && typeof body.path === 'string') {
        path = body.path.slice(0, 200);
      }
    } catch {
      // Body parsing optional
    }

    // Don't record admin pages as public site visits
    if (path.startsWith('/admin')) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const visit = await prisma.siteVisit.create({
      data: { path },
    });

    return NextResponse.json({ success: true, id: visit.id });
  } catch (error) {
    console.error('Error logging site visit:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
