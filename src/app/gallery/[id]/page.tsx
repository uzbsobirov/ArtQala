import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPaintingById, getRelatedPaintings } from '@/lib/api';
import PaintingDetailClient from './PaintingDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const painting = await getPaintingById(id);

  if (!painting) {
    return {
      title: 'Painting Not Found',
    };
  }

  let imageUrl = '/assets/p-arch.svg';
  try {
    const parsed = JSON.parse(painting.images);
    if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
  } catch {
    if (painting.images && !painting.images.startsWith('[')) {
      imageUrl = painting.images;
    }
  }

  const title = `${painting.title_en} by ${painting.artist.name}`;
  const description =
    painting.description_en ||
    `${painting.title_en} — original ${painting.technique_en} painting (${painting.size}) by ${painting.artist.name}. Art Qala Gallery, Tashkent.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Art Qala Gallery`,
      description,
      images: [{ url: imageUrl, alt: painting.title_en }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Art Qala Gallery`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function PaintingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const painting = await getPaintingById(id);

  if (!painting) {
    notFound();
  }

  const relatedPaintings = await getRelatedPaintings(
    painting.id,
    painting.artist_id,
    painting.category_id
  );

  return <PaintingDetailClient painting={painting} relatedPaintings={relatedPaintings} />;
}
