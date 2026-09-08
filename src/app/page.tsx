import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedPaintings } from '@/lib/api';
import HomeClient from './HomeClient';

export default async function HomePage() {
  const featuredPaintings = await getFeaturedPaintings();

  return <HomeClient featuredPaintings={featuredPaintings} />;
}
