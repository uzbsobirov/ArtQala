import React from 'react';
import { notFound } from 'next/navigation';
import { getPaintingById } from '@/lib/api';
import PaintingDetailClient from './PaintingDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PaintingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const painting = await getPaintingById(id);

  if (!painting) {
    notFound();
  }

  return <PaintingDetailClient painting={painting} />;
}
