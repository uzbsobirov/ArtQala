'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Printer, ArrowLeft, Award } from 'lucide-react';

interface CertificateClientProps {
  painting: any;
}

export default function CertificateClient({ painting }: CertificateClientProps) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const certNumber = `AQ-${new Date(painting.created_at).getFullYear()}-${painting.id.slice(-6).toUpperCase()}`;

  return (
    <div className="py-12 sm:py-16 px-6">
      <div className="max-w-[820px] mx-auto space-y-6">
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between print:hidden">
          <Link
            href={`/gallery/${painting.id}`}
            className="text-xs font-semibold text-[#BA4E25] hover:underline flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Painting</span>
          </Link>

          <button
            onClick={handlePrint}
            className="bg-[#281C18] hover:bg-[#BA4E25] text-white text-xs font-semibold px-4 py-2 rounded-[3px] transition-all flex items-center gap-2 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Certificate</span>
          </button>
        </div>

        {/* Printable Certificate Frame */}
        <div className="bg-[#FFFDF9] border-[6px] border-[#DAA932] p-8 sm:p-14 shadow-2xl relative overflow-hidden rounded-[2px]">
          {/* Inner ornamental double border */}
          <div className="border border-[#DAA932]/60 p-6 sm:p-10 relative">
            {/* Corner rosettes */}
            <div className="absolute top-2 left-2 text-[#DAA932] font-serif text-2xl font-bold">✦</div>
            <div className="absolute top-2 right-2 text-[#DAA932] font-serif text-2xl font-bold">✦</div>
            <div className="absolute bottom-2 left-2 text-[#DAA932] font-serif text-2xl font-bold">✦</div>
            <div className="absolute bottom-2 right-2 text-[#DAA932] font-serif text-2xl font-bold">✦</div>

            {/* Header */}
            <div className="text-center space-y-2 mb-8">
              <Image
                src="/logo.png"
                alt="Art Qala"
                width={140}
                height={46}
                className="h-12 w-auto mx-auto object-contain mb-2"
              />
              <span className="text-[10px] tracking-[4px] text-[#BA4E25] font-bold uppercase block">
                TASHKENT · REPUBLIC OF UZBEKISTAN
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wider text-[#281C18] pt-2">
                Certificate of Authenticity
              </h1>
              <div className="w-32 h-[1.5px] bg-[#DAA932] mx-auto my-3" />
              <p className="text-xs text-[#726861] max-w-md mx-auto italic">
                This document certifies that the artwork detailed below is an authentic, original creation registered in the permanent archives of Art Qala Gallery.
              </p>
            </div>

            {/* Artwork Details Block */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 py-6 border-y border-[#E7E0D8] text-xs max-w-lg mx-auto my-6">
              <div>
                <span className="text-[#8F8178] uppercase font-bold text-[10px] block">
                  Title of Artwork
                </span>
                <span className="font-serif text-lg font-bold text-[#281C18]">
                  {painting.title_en}
                </span>
              </div>

              <div>
                <span className="text-[#8F8178] uppercase font-bold text-[10px] block">
                  Master Artist
                </span>
                <span className="font-serif text-lg font-bold text-[#281C18]">
                  {painting.artist?.name}
                </span>
              </div>

              <div>
                <span className="text-[#8F8178] uppercase font-bold text-[10px] block">
                  Medium &amp; Technique
                </span>
                <span className="font-semibold text-[#281C18]">
                  {painting.technique_en}
                </span>
              </div>

              <div>
                <span className="text-[#8F8178] uppercase font-bold text-[10px] block">
                  Dimensions
                </span>
                <span className="font-semibold text-[#281C18]">
                  {painting.size}
                </span>
              </div>

              <div>
                <span className="text-[#8F8178] uppercase font-bold text-[10px] block">
                  Year of Creation
                </span>
                <span className="font-semibold text-[#281C18]">
                  {painting.year}
                </span>
              </div>

              <div>
                <span className="text-[#8F8178] uppercase font-bold text-[10px] block">
                  Certificate Number
                </span>
                <span className="font-mono font-bold text-[#BA4E25]">
                  {certNumber}
                </span>
              </div>
            </div>

            {/* Signatures & Seal Section */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-8 max-w-lg mx-auto">
              <div className="text-center sm:text-left space-y-1">
                <div className="font-serif italic text-lg text-[#281C18] border-b border-[#281C18]/40 pb-1 w-44">
                  {painting.artist?.name}
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#8F8178] block font-bold">
                  Artist Signature
                </span>
              </div>

              {/* Gallery Gold Seal */}
              <div className="w-20 h-20 rounded-full border-2 border-[#DAA932] p-1 flex items-center justify-center bg-[#FFFDF9] shadow-sm shrink-0">
                <div className="w-full h-full rounded-full border border-dashed border-[#DAA932] flex flex-col items-center justify-center text-center p-1">
                  <Award className="w-5 h-5 text-[#DAA932]" />
                  <span className="text-[7.5px] font-bold tracking-widest text-[#281C18] uppercase mt-0.5">
                    ART QALA
                  </span>
                  <span className="text-[6px] text-[#BA4E25] font-semibold">
                    OFFICIAL SEAL
                  </span>
                </div>
              </div>

              <div className="text-center sm:text-right space-y-1">
                <div className="font-serif italic text-lg text-[#281C18] border-b border-[#281C18]/40 pb-1 w-44 sm:ml-auto">
                  Anvar K.
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#8F8178] block font-bold">
                  Head Curator, Art Qala
                </span>
              </div>
            </div>

            {/* Footer verification note */}
            <div className="text-center pt-8 text-[9px] text-[#A8988E]">
              Art Qala Gallery · Barakhon Madrasah, Tashkent, Uzbekistan · Registered Cultural Property Document
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
