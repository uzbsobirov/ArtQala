import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedPaintings } from '@/lib/api';
import HomeClient from './HomeClient';

// See src/app/gallery/page.tsx for why this is a cache window instead of
// rendering fresh on every request.
export const revalidate = 30;

export default async function HomePage() {
  const featuredPaintings = await getFeaturedPaintings();

  return <HomeClient featuredPaintings={featuredPaintings} />;
}
