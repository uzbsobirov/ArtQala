import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminPaintingsClient from './AdminPaintingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminPaintingsPage() {
  const paintings = await prisma.painting.findMany({
    include: {
      artist: true,
      category: true,
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
