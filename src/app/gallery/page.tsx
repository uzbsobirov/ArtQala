import React from 'react';
import { getAllPaintings, getCategories } from '@/lib/api';
import GalleryClient from './GalleryClient';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const paintings = await getAllPaintings();
  const categories = await getCategories();

  return <GalleryClient paintings={paintings} categories={categories} />;
}
