import React from 'react';
import { prisma } from '@/lib/prisma';
import { Star, Check, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      painting: { select: { title_en: true } },
    },
    orderBy: { created_at: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-semibold text-[#281C18]">
          Customer Reviews &amp; Testimonials
        </h2>
        <p className="text-xs text-[#726861] mt-0.5">
          Approve and moderate feedback from gallery visitors and art collectors
        </p>
      </div>

      <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF4EC] border-b border-[#E7E0D8] text-[#8F8178] font-bold tracking-wider uppercase text-[10.5px]">
              <th className="py-3 px-4">AUTHOR</th>
              <th className="py-3 px-4">RATING</th>
              <th className="py-3 px-4">REVIEW</th>
              <th className="py-3 px-4">PAINTING</th>
              <th className="py-3 px-4">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1]">
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <tr key={r.id} className="hover:bg-[#FAF4EC]/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#281C18]">
                    {r.author_name}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center text-[#DAA932]">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#554740] max-w-sm">"{r.text}"</td>
                  <td className="py-3.5 px-4 text-[#726861]">
                    {r.painting?.title_en || 'General Gallery'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-[#DCFCE7] text-[#16A34A] text-[10.5px] font-bold px-2 py-0.5 rounded-full">
                      Approved
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-[#8F8178]">
                  No reviews submitted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
