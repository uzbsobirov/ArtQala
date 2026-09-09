import React from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ReviewsClient from './ReviewsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Client Reviews & Collector Testimonials | Art Qala',
  description: 'Read authentic reviews from international art collectors and clients who acquired original paintings and commissioned murals from Art Qala Gallery.',
  openGraph: {
    title: 'Collector Reviews & Testimonials | Art Qala Gallery',
    description: 'Authentic reviews and testimonials from collectors of original Uzbek contemporary and classical paintings.',
  },
};

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { is_approved: true },
    include: {
      painting: { select: { id: true, title_en: true, title_ru: true, title_uz: true } },
    },
    orderBy: { created_at: 'desc' },
  });

  return <ReviewsClient initialReviews={reviews} />;
}

