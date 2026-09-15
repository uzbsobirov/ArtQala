import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminPaintingsClient from './AdminPaintingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminPaintingsPage() {
  const paintings = await prisma.painting.findMany({
    include: {
      artist: true,
      category: true,
      // The final agreed sale price is recorded on the Inquiry that led to
      // the sale (curator-entered, see AdminInquiriesClient), not on the
      // Painting itself — pull the most recently completed one so the sold
      // price can be shown next to the "Sold" badge.
      inquiries: {
        where: { status: 'COMPLETED', final_price: { not: null } },
        orderBy: { updated_at: 'desc' },
        take: 1,
        select: { final_price: true },
      },
    },
    orderBy: { created_at: 'desc' },
  });

  const categories = await prisma.category.findMany();
  const artists = await prisma.artist.findMany();

  return (
    <AdminPaintingsClient
      initialPaintings={paintings}
      categories={categories}
      artists={artists}
    />
  );
}
