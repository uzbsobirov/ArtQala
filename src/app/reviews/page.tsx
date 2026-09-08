import React from 'react';
import { prisma } from '@/lib/prisma';
import ReviewsClient from './ReviewsClient';

export const dynamic = 'force-dynamic';

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { is_approved: true },
    include: {
      painting: { select: { id: true, title_en: true } },
    },
    orderBy: { created_at: 'desc' },
  });

  return <ReviewsClient initialReviews={reviews} />;
}
