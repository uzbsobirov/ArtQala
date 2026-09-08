import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { paintings: true } },
    },
    orderBy: { name_en: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-semibold text-[#281C18]">
          Categories Management
        </h2>
        <p className="text-xs text-[#726861] mt-0.5">
          Painting genres and themes shown in client filters and gallery dropdowns
        </p>
      </div>

      <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF4EC] border-b border-[#E7E0D8] text-[#8F8178] font-bold tracking-wider uppercase text-[10.5px]">
              <th className="py-3 px-4">NAME (EN)</th>
              <th className="py-3 px-4">NAME (RU)</th>
              <th className="py-3 px-4">NAME (UZ)</th>
              <th className="py-3 px-4">SLUG</th>
              <th className="py-3 px-4 text-right">TOTAL WORKS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1]">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-[#FAF4EC]/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-[#281C18]">
                  {c.name_en}
                </td>
                <td className="py-3.5 px-4 text-[#554740]">{c.name_ru}</td>
                <td className="py-3.5 px-4 text-[#554740]">{c.name_uz}</td>
                <td className="py-3.5 px-4 font-mono text-[#8F8178]">{c.slug}</td>
                <td className="py-3.5 px-4 text-right font-bold text-[#BA4E25]">
                  {c._count.paintings}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
