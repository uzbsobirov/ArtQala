import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminAccessoriesClient from './AdminAccessoriesClient';

export const dynamic = 'force-dynamic';

export default async function AdminAccessoriesPage() {
  const accessories = await prisma.accessory.findMany({
    include: { categories: { select: { id: true, name_en: true, name_ru: true, name_uz: true } } },
    orderBy: { created_at: 'desc' },
  });
  const categories = await prisma.category.findMany({
    select: { id: true, name_en: true, name_ru: true, name_uz: true },
    orderBy: { name_en: 'asc' },
  });

  return <AdminAccessoriesClient initialAccessories={accessories} categories={categories} />;
}
