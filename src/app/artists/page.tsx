import React from 'react';
import { getArtists } from '@/lib/api';
import ArtistsClient from './ArtistsClient';

export const dynamic = 'force-dynamic';

export default async function ArtistsPage() {
  const artists = await getArtists();

  return <ArtistsClient artists={artists} />;
}
