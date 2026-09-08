import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminDiscountsClient from './AdminDiscountsClient';

export const dynamic = 'force-dynamic';

export default async function AdminDiscountsPage() {
  const discounts = await prisma.discount.findMany({
    orderBy: { created_at: 'desc' },
  });
  const paintings = await prisma.painting.findMany({ select: { id: true, title_en: true } });
  const artists = await prisma.artist.findMany({ select: { id: true, name: true } });
  const categories = await prisma.category.findMany({ select: { id: true, name_en: true } });

  return (
    <AdminDiscountsClient
      initialDiscounts={discounts}
      paintings={paintings}
      artists={artists}
      categories={categories}
    />
  );
}
