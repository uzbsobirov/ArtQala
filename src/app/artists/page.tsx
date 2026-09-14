import React from 'react';
import type { Metadata } from 'next';
import { getArtists } from '@/lib/api';
import { buildBreadcrumbJsonLd } from '@/lib/breadcrumbJsonLd';
import ArtistsClient from './ArtistsClient';

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXTAUTH_URL || 'https://artqala.uz';
const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: 'Artists', path: '/artists' }], siteUrl);

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

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ArtistsClient artists={artists} />
    </>
  );
}
