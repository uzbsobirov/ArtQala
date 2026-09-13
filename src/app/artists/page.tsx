import React from 'react';
import type { Metadata } from 'next';
import { getArtists } from '@/lib/api';
import ArtistsClient from './ArtistsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Artists — Uzbek Masters & Painters',
  description:
    'Meet the resident painters, ceramists, and mural artists of Art Qala Gallery creating original Central Asian works in Tashkent.',
  alternates: { canonical: '/artists' },
  openGraph: {
    title: 'Artists — Uzbek Masters | Art Qala',
    description: 'Meet the master painters and craftspeople behind Art Qala artworks.',
  },
};

export default async function ArtistsPage() {
  const artists = await getArtists();

  return <ArtistsClient artists={artists} />;
}
