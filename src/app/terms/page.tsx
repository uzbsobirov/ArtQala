import React from 'react';

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-20 px-6">
      <div className="max-w-3xl mx-auto bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-8 sm:p-12 space-y-6">
        <div className="space-y-2 border-b border-[#E7E0D8] pb-6">
          <span className="text-xs font-semibold tracking-[3px] text-[#429599] uppercase">
            TERMS &amp; CONDITIONS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#281C18]">
            Terms of Service
          </h1>
          <p className="text-xs text-[#8F8178]">
            Effective Date: September 2026 · Art Qala Gallery, Samarkand
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#4D3F38] leading-relaxed">
          <h2 className="font-serif text-xl font-semibold text-[#281C18]">
            1. Original Artworks &amp; Authenticity
          </h2>
          <p>
            All paintings featured on Art Qala are original, one-of-a-kind canvases handcrafted by registered masters in Uzbekistan. Each purchased original artwork is accompanied by an official Certificate of Authenticity bearing the artist's signature and the gallery's embossed seal.
          </p>

          <h2 className="font-serif text-xl font-semibold text-[#281C18]">
            2. Inquiries and Reservation
          </h2>
          <p>
            Submission of an inquiry on this platform does not constitute a binding financial charge. Our curators will review availability, calculate international insured freight or arrange personal collection at our Samarkand location, and provide a formal invoice.
          </p>

          <h2 className="font-serif text-xl font-semibold text-[#281C18]">
            3. Bespoke Services &amp; Murals
          </h2>
          <p>
            Quotes for custom paintings and wall murals include surface preparation, concept sketches, and on-site painting. Project schedules and milestone payments are confirmed individually per contract.
          </p>

          <h2 className="font-serif text-xl font-semibold text-[#281C18]">
            4. Cultural Heritage Regulations
          </h2>
          <p>
            All contemporary artworks exported internationally comply fully with Ministry of Culture regulations of the Republic of Uzbekistan. We provide all necessary export clearance documentation for seamless customs transit.
          </p>
        </div>
      </div>
    </div>
  );
}
