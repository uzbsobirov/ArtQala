import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminAccessoriesClient from './AdminAccessoriesClient';

export const dynamic = 'force-dynamic';

export default async function AdminAccessoriesPage() {
  const [accessories, categories] = await Promise.all([
    prisma.accessory.findMany({ orderBy: { created_at: 'desc' } }),
    // Only top-level categories are physical product types — accessories are
    // scoped to those, not to the subject-matter sub-categories under them.
    prisma.category.findMany({ where: { parent_id: null }, orderBy: { name_uz: 'asc' } }),
  ]);

  return <AdminAccessoriesClient initialAccessories={accessories} categories={categories} />;
}
