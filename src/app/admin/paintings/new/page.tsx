import React from 'react';
import { prisma } from '@/lib/prisma';
import PaintingForm from '../PaintingForm';

export const dynamic = 'force-dynamic';

export default async function NewPaintingPage() {
  const artists = await prisma.artist.findMany();
  const categories = await prisma.category.findMany();

  return <PaintingForm artists={artists} categories={categories} isNew={true} />;
}
