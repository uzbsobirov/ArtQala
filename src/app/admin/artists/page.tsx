import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminArtistsClient from './AdminArtistsClient';

export const dynamic = 'force-dynamic';

export default async function AdminArtistsPage() {
  const [artists, categories] = await Promise.all([
    prisma.artist.findMany({
      include: {
        category: true,
        _count: { select: { paintings: true } },
      },
      orderBy: { created_at: 'desc' },
    }),
    // Only top-level categories are product types — an artist's "yo'nalishi".
    prisma.category.findMany({ where: { parent_id: null }, orderBy: { name_uz: 'asc' } }),
  ]);

  return <AdminArtistsClient initialArtists={artists} categories={categories} />;
}
