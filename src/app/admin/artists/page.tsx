import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminArtistsClient from './AdminArtistsClient';

export const dynamic = 'force-dynamic';

export default async function AdminArtistsPage() {
  const artists = await prisma.artist.findMany({
    include: {
      _count: { select: { paintings: true } },
    },
    orderBy: { created_at: 'desc' },
  });

  return <AdminArtistsClient initialArtists={artists} />;
}
