import React from 'react';
import type { Metadata } from 'next';
import { getAllPaintings, getCategories } from '@/lib/api';
import GalleryClient from './GalleryClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gallery — Original Paintings Collection',
  description:
    'Explore original Uzbek oil and acrylic paintings of historical monuments, portraits, and courtyards at Art Qala Gallery in Tashkent.',
  openGraph: {
    title: 'Gallery — Original Paintings | Art Qala',
    description: 'Browse our collection of original Uzbek paintings with worldwide shipping.',
  },
};

export default async function GalleryPage() {
  const paintings = await getAllPaintings();
  const categories = await getCategories();

  return <GalleryClient paintings={paintings} categories={categories} />;
}
