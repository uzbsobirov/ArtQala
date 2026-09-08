'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload, Check, AlertCircle } from 'lucide-react';

interface PaintingFormProps {
  initialData?: any;
  artists: any[];
  categories: any[];
  isNew?: boolean;
}

export default function PaintingForm({
  initialData,
  artists,
  categories,
  isNew = false,
}: PaintingFormProps) {
  const router = useRouter();

  const [titleEn, setTitleEn] = useState(initialData?.title_en || '');
  const [descriptionEn, setDescriptionEn] = useState(initialData?.description_en || '');
  const [size, setSize] = useState(initialData?.size || '60 × 80 cm');
  const [techniqueEn, setTechniqueEn] = useState(initialData?.technique_en || 'Oil on canvas');
  const [year, setYear] = useState(initialData?.year || 2024);
  const [artistId, setArtistId] = useState(initialData?.artist_id || artists[0]?.id || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || categories[0]?.id || '');

  // Pricing
  const [price, setPrice] = useState(initialData?.price || 420);
  const [discountPercent, setDiscountPercent] = useState('15%');
  const [discountStarts, setDiscountStarts] = useState(
    initialData?.discount_starts_at
      ? new Date(initialData.discount_starts_at).toISOString().split('T')[0]
      : '2026-09-10'
  );
  const [discountEnds, setDiscountEnds] = useState(
    initialData?.discount_ends_at
      ? new Date(initialData.discount_ends_at).toISOString().split('T')[0]
      : '2026-09-20'
  );
  const [discountScope, setDiscountScope] = useState<'PAINTING' | 'ARTIST' | 'CATEGORY'>('PAINTING');

  // Toggles
  const [isSold, setIsSold] = useState(initialData?.is_sold || false);
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured !== undefined ? initialData.is_featured : true);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Calculate live preview
  const numPercent = parseFloat(discountPercent.replace('%', '')) || 0;
  const calculatedDiscountPrice =
    numPercent > 0 ? Math.round(price * (1 - numPercent / 100)) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const payload = {
      title_en: titleEn,
      description_en: descriptionEn,
      size,
      technique_en: techniqueEn,
      year: parseInt(year),
      artist_id: artistId,
      category_id: categoryId,
      price: parseFloat(price),
      discount_price: calculatedDiscountPrice,
      discount_starts_at: discountStarts ? new Date(discountStarts) : null,
      discount_ends_at: discountEnds ? new Date(discountEnds) : null,
      is_sold: isSold,
      is_featured: isFeatured,
      images: initialData?.images || JSON.stringify(['/assets/p-arch.svg']),
    };

    try {
      const url = isNew ? '/api/admin/paintings' : `/api/admin/paintings/${initialData.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Painting saved successfully!');
        setTimeout(() => {
          router.push('/admin/paintings');
        }, 1000);
      } else {
        setMessage('Failed to save painting.');
      }
    } catch (err) {
      setMessage('Error saving painting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top action header matching AdminPaintingForm.png */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E7E0D8]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/paintings"
            className="p-1.5 text-[#726861] hover:text-[#BA4E25] rounded hover:bg-[#FAF4EC]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="font-serif text-2xl font-semibold text-[#281C18]">
            {isNew ? 'New Painting' : `Edit Painting — ${titleEn || 'Registon at Dusk'}`}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/paintings"
            className="px-4 py-2 border border-[#E7E0D8] bg-white text-xs font-semibold text-[#554740] rounded-[3px] hover:bg-[#FAF4EC] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-[#BA4E25] hover:bg-[#9C3E1B] text-white text-xs font-semibold rounded-[3px] transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-[#E8F5E9] border border-[#A5D6A7] rounded-[3px] text-xs text-[#1B5E20]">
          {message}
        </div>
      )}

      {/* 2-Column Form Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Details + Images) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Details Panel */}
          <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 space-y-4">
            <h3 className="text-xs font-bold tracking-wider text-[#BA4E25] uppercase">
              DETAILS
            </h3>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                TITLE
              </label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Registon at Dusk"
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                DESCRIPTION
              </label>
              <textarea
                rows={3}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="Oil on canvas view of the Registan ensemble at golden hour..."
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25] resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                  SIZE (CM)
                </label>
                <input
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="60 × 80"
                  className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                  TECHNIQUE
                </label>
                <input
                  type="text"
                  value={techniqueEn}
                  onChange={(e) => setTechniqueEn(e.target.value)}
                  placeholder="Oil on canvas"
                  className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                  YEAR
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                  ARTIST
                </label>
                <select
                  value={artistId}
                  onChange={(e) => setArtistId(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
                >
                  {artists.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                  CATEGORY
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name_en}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Images Upload Box */}
          <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 space-y-3">
            <h3 className="text-xs font-bold tracking-wider text-[#BA4E25] uppercase">
              IMAGES
            </h3>
            <div className="border-2 border-dashed border-[#D2C5BA] rounded-[4px] p-8 text-center bg-[#FAF4EC]/40 hover:bg-[#FAF4EC] transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-[#8F8178] mx-auto mb-2" />
              <p className="text-xs text-[#554740]">
                Drag images here or click to upload — first image is used as the cover
              </p>
              <span className="text-[10px] text-[#A8988E] mt-1 block">
                Supports JPG, PNG, WEBP up to 10MB
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (Pricing & Toggles) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pricing Panel */}
          <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 space-y-4">
            <h3 className="text-xs font-bold tracking-wider text-[#BA4E25] uppercase">
              PRICING
            </h3>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                ORIGINAL PRICE (USD)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                placeholder="420"
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
              />
            </div>

            {/* Scope selection pills matching AdminPaintingForm.png */}
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1.5">
                DISCOUNT INHERITANCE
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setDiscountScope('PAINTING')}
                  className={`text-[11px] px-3 py-1.5 rounded-full border transition-all ${
                    discountScope === 'PAINTING'
                      ? 'bg-[#281C18] text-white border-[#281C18]'
                      : 'bg-white text-[#554740] border-[#E7E0D8]'
                  }`}
                >
                  This painting
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountScope('ARTIST')}
                  className={`text-[11px] px-3 py-1.5 rounded-full border transition-all ${
                    discountScope === 'ARTIST'
                      ? 'bg-[#281C18] text-white border-[#281C18]'
                      : 'bg-white text-[#554740] border-[#E7E0D8]'
                  }`}
                >
                  Inherit from artist
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountScope('CATEGORY')}
                  className={`text-[11px] px-3 py-1.5 rounded-full border transition-all ${
                    discountScope === 'CATEGORY'
                      ? 'bg-[#281C18] text-white border-[#281C18]'
                      : 'bg-white text-[#554740] border-[#E7E0D8]'
                  }`}
                >
                  Inherit from category
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                DISCOUNT
              </label>
              <input
                type="text"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="15%"
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10.5px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                  STARTS
                </label>
                <input
                  type="date"
                  value={discountStarts}
                  onChange={(e) => setDiscountStarts(e.target.value)}
                  className="w-full text-[11px] px-2.5 py-1.5 bg-white border border-[#E7E0D8] rounded-[3px]"
                />
              </div>
              <div>
                <label className="block text-[10.5px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                  ENDS
                </label>
                <input
                  type="date"
                  value={discountEnds}
                  onChange={(e) => setDiscountEnds(e.target.value)}
                  className="w-full text-[11px] px-2.5 py-1.5 bg-white border border-[#E7E0D8] rounded-[3px]"
                />
              </div>
            </div>

            {/* Live price preview matching AdminPaintingForm.png */}
            <div className="pt-2 border-t border-[#F0EAE1]">
              <span className="block text-[10.5px] font-bold tracking-wider text-[#8F8178] uppercase mb-1">
                PREVIEW
              </span>
              <div className="flex items-baseline gap-2">
                <span className="line-through text-[#9E9086] text-sm">${price}</span>
                <span className="font-bold text-[#BA4E25] text-lg">
                  ${calculatedDiscountPrice || price}
                </span>
              </div>
            </div>
          </div>

          {/* Toggles Panel matching AdminPaintingForm.png */}
          <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#281C18]">Mark as Sold</span>
              <button
                type="button"
                onClick={() => setIsSold(!isSold)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  isSold ? 'bg-[#BA4E25]' : 'bg-[#E7E0D8]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isSold ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F0EAE1]">
              <span className="text-xs font-semibold text-[#281C18]">Featured on homepage</span>
              <button
                type="button"
                onClick={() => setIsFeatured(!isFeatured)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  isFeatured ? 'bg-[#BA4E25]' : 'bg-[#E7E0D8]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isFeatured ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
