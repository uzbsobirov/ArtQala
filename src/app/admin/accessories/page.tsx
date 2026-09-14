import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminAccessoriesClient from './AdminAccessoriesClient';

export const dynamic = 'force-dynamic';

export default async function AdminAccessoriesPage() {
  const [accessories, categories] = await Promise.all([
    prisma.accessory.findMany({ orderBy: { created_at: 'desc' } }),
    prisma.category.findMany({ orderBy: { name_uz: 'asc' } }),
  ]);

  return <AdminAccessoriesClient initialAccessories={accessories} categories={categories} />;
}
