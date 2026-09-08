import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PaintingForm from '../PaintingForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function EditPaintingPage({ params }: PageProps) {
  const { id } = await params;
  const painting = await prisma.painting.findUnique({
    where: { id },
  });

  if (!painting) {
    notFound();
  }

  const artists = await prisma.artist.findMany();
  const categories = await prisma.category.findMany();

  return (
    <PaintingForm
      initialData={painting}
      artists={artists}
      categories={categories}
      isNew={false}
    />
  );
}
