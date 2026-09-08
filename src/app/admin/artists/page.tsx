import React from 'react';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminArtistsPage() {
  const artists = await prisma.artist.findMany({
    include: {
      _count: { select: { paintings: true } },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#281C18]">
            Artists Management
          </h2>
          <p className="text-xs text-[#726861] mt-0.5">
            Registered painters and craftspeople representing the gallery
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((a) => (
          <div
            key={a.id}
            className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 space-y-4 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#BA4E25] text-white font-serif font-bold text-lg flex items-center justify-center">
                {a.initials || a.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-serif font-semibold text-lg text-[#281C18]">
                  {a.name}
                </h3>
                <span className="text-[10.5px] font-bold tracking-wider text-[#429599] uppercase">
                  {a.specialty_en}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#5F534C] leading-relaxed line-clamp-3">
              {a.bio_en}
            </p>

            <div className="pt-2 border-t border-[#F0EAE1] flex items-center justify-between text-xs text-[#726861]">
              <span>Active Works: <strong className="text-[#281C18]">{a._count.paintings}</strong></span>
              <Link
                href={`/admin/paintings?artist=${a.id}`}
                className="text-[#BA4E25] font-semibold hover:underline"
              >
                View paintings →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
