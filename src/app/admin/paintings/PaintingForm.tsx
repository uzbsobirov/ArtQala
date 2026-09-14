'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Upload,
  Check,
  AlertCircle,
  Plus,
  X,
  Loader2,
  Trash2,
  Sparkles,
  Languages,
} from 'lucide-react';
import AiBackgroundModal from './AiBackgroundModal';
import ImageCropModal from './ImageCropModal';

interface PaintingFormProps {
  initialData?: any;
  artists: any[];
  categories: any[];
  isNew?: boolean;
}

export default function PaintingForm({
  initialData,
  artists: initialArtists,
  categories: initialCategories,
  isNew = false,
}: PaintingFormProps) {
  const router = useRouter();

  // Lists with dynamic additions
  const [artistsList, setArtistsList] = useState(initialArtists || []);
  const [categoriesList, setCategoriesList] = useState(initialCategories || []);

  // Form fields (EN / RU / UZ)
  const [titleUz, setTitleUz] = useState(initialData?.title_uz || '');
  const [titleEn, setTitleEn] = useState(initialData?.title_en || '');
  const [titleRu, setTitleRu] = useState(initialData?.title_ru || '');

  const [descriptionUz, setDescriptionUz] = useState(initialData?.description_uz || '');
  const [descriptionEn, setDescriptionEn] = useState(initialData?.description_en || '');
  const [descriptionRu, setDescriptionRu] = useState(initialData?.description_ru || '');

  // Structured size parsing (e.g. "60 × 80 sm" or "60x80")
  const parseSize = (sizeStr?: string) => {
    if (!sizeStr) return { width: 60, height: 80, unit: 'sm' };
    const parts = sizeStr.match(/(\d+)\s*[×x*X]\s*(\d+)(?:\s*(sm|cm|in|dyum))?/i);
    if (parts) {
      const u = (parts[3] || 'sm').toLowerCase();
      return {
        width: parseInt(parts[1]) || 60,
        height: parseInt(parts[2]) || 80,
        unit: u === 'in' || u === 'dyum' ? 'dyum' : 'sm',
      };
    }
    return { width: 60, height: 80, unit: 'sm' };
  };

  const initialParsedSize = parseSize(initialData?.size);
  const [sizeWidth, setSizeWidth] = useState<number>(initialParsedSize.width);
  const [sizeHeight, setSizeHeight] = useState<number>(initialParsedSize.height);
  const [sizeUnit, setSizeUnit] = useState<string>(initialParsedSize.unit);

  // Empty by default (not pre-filled with the "Oil on canvas" example) so
  // autoTranslate's "don't overwrite a field the admin already filled in"
  // check doesn't mistake the placeholder text for a real answer and skip
  // translating technique into EN/RU.
  const [techniqueUz, setTechniqueUz] = useState(initialData?.technique_uz || '');
  const [techniqueEn, setTechniqueEn] = useState(initialData?.technique_en || '');
  const [techniqueRu, setTechniqueRu] = useState(initialData?.technique_ru || '');
  const [year, setYear] = useState(initialData?.year || 2024);
  const [artistId, setArtistId] = useState(initialData?.artist_id || initialArtists[0]?.id || '');

  // Category is picked in two steps — ota (product type) then bola (subject)
  // — so it's always clear exactly which one a painting lands in, instead of
  // one flat dropdown mixing both levels together.
  const initialCategory = initialCategories.find(
    (c: any) => c.id === (initialData?.category_id || initialCategories[0]?.id)
  );
  const [categoryId, setCategoryId] = useState(
    initialData?.category_id || initialCategories[0]?.id || ''
  );
  const [topCategoryId, setTopCategoryId] = useState<string>(
    (initialCategory as any)?.parent_id || initialCategory?.id || ''
  );

  // Images array
  const initialImages: string[] = (() => {
    try {
      if (initialData?.images) {
        const parsed = typeof initialData.images === 'string' ? JSON.parse(initialData.images) : initialData.images;
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return ['/assets/p-arch.svg'];
  })();
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pendingCropFile, setPendingCropFile] = useState<File | null>(null);
  const [aiEditIndex, setAiEditIndex] = useState<number | null>(null);

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

  // Modals for adding inline Artist or Category
  const [showAddArtistModal, setShowAddArtistModal] = useState(false);
  const [newArtistName, setNewArtistName] = useState('');
  const [newArtistSpecialtyUz, setNewArtistSpecialtyUz] = useState('');
  const [newArtistSpecialtyEn, setNewArtistSpecialtyEn] = useState('');
  const [newArtistSpecialtyRu, setNewArtistSpecialtyRu] = useState('');
  const [newArtistBioUz, setNewArtistBioUz] = useState('');
  const [newArtistBioEn, setNewArtistBioEn] = useState('');
  const [newArtistBioRu, setNewArtistBioRu] = useState('');
  const [newArtistCategoryId, setNewArtistCategoryId] = useState('');
  const [addingArtist, setAddingArtist] = useState(false);

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryNameUz, setNewCategoryNameUz] = useState('');
  const [newCategoryNameEn, setNewCategoryNameEn] = useState('');
  const [newCategoryNameRu, setNewCategoryNameRu] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');
  const [newCategorySlugManual, setNewCategorySlugManual] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  // A category created while adding a painting is almost always a subject
  // (Nature, Portraits, ...) of an existing product type — default to
  // "Kartina" if it exists, otherwise leave it as its own top-level type.
  const topLevelCategoryOptions = categoriesList.filter((c: any) => !c.parent_id);
  const [newCategoryParentId, setNewCategoryParentId] = useState<string>(
    () => topLevelCategoryOptions.find((c: any) => c.slug === 'kartina')?.id || ''
  );

  // Auto-translation: typing in UZ or RU auto-fills the other two languages
  // (via Gemini) for whichever field group was just edited. Never overwrites
  // a field the admin has already filled in.
  const [translatingGroup, setTranslatingGroup] = useState<string | null>(null);

  const fieldGroups = {
    title: {
      uz: [titleUz, setTitleUz] as const,
      ru: [titleRu, setTitleRu] as const,
      en: [titleEn, setTitleEn] as const,
    },
    description: {
      uz: [descriptionUz, setDescriptionUz] as const,
      ru: [descriptionRu, setDescriptionRu] as const,
      en: [descriptionEn, setDescriptionEn] as const,
    },
    technique: {
      uz: [techniqueUz, setTechniqueUz] as const,
      ru: [techniqueRu, setTechniqueRu] as const,
      en: [techniqueEn, setTechniqueEn] as const,
    },
    // Inline "add artist" / "add category" modal fields — same UZ->EN/RU
    // convenience, just kept out of the main painting fields above.
    newArtistSpecialty: {
      uz: [newArtistSpecialtyUz, setNewArtistSpecialtyUz] as const,
      ru: [newArtistSpecialtyRu, setNewArtistSpecialtyRu] as const,
      en: [newArtistSpecialtyEn, setNewArtistSpecialtyEn] as const,
    },
    newArtistBio: {
      uz: [newArtistBioUz, setNewArtistBioUz] as const,
      ru: [newArtistBioRu, setNewArtistBioRu] as const,
      en: [newArtistBioEn, setNewArtistBioEn] as const,
    },
    newCategoryName: {
      uz: [newCategoryNameUz, setNewCategoryNameUz] as const,
      ru: [newCategoryNameRu, setNewCategoryNameRu] as const,
      en: [newCategoryNameEn, setNewCategoryNameEn] as const,
    },
  };

  const autoTranslate = async (
    group: keyof typeof fieldGroups,
    sourceLang: 'uz' | 'ru',
    text: string
  ) => {
    if (!text.trim()) return;
    const groupFields = fieldGroups[group];
    setTranslatingGroup(group);
    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sourceLang }),
      });
      const data = await res.json();
      if (data.success && data.translations) {
        (['uz', 'ru', 'en'] as const).forEach((lang) => {
          if (lang === sourceLang) return;
          const value = data.translations[lang];
          const [currentValue, setValue] = groupFields[lang];
          if (value && !currentValue.trim()) {
            setValue(value);
          }
        });
      }
    } catch {
      // Silent failure — auto-translation is a convenience, not required to save the form.
    } finally {
      setTranslatingGroup(null);
    }
  };

  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[ʻʼ'`]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Calculate live preview
  const numPercent = parseFloat(discountPercent.replace('%', '')) || 0;
  const calculatedDiscountPrice =
    numPercent > 0 ? Math.round(price * (1 - numPercent / 100)) : null;

  // Actually POSTs a file (original or cropped) to the upload API.
  const uploadFile = async (fileToUpload: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', fileToUpload);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setImages((prev) => [data.url, ...prev]);
      } else {
        alert(data.error || 'Rasm yuklashda xatolik yuz berdi');
      }
    } catch {
      alert('Rasm yuklashda xatolik yuz berdi');
    } finally {
      setUploadingImage(false);
    }
  };

  // File picked — open the crop tool instead of uploading immediately.
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingCropFile(file);
    // Allow re-selecting the exact same file later.
    e.target.value = '';
  };

  const handleCreateArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtistName.trim()) return;
    setAddingArtist(true);
    try {
      const res = await fetch('/api/admin/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newArtistName,
          specialty_uz: newArtistSpecialtyUz || 'Rassom',
          specialty_en: newArtistSpecialtyEn || newArtistSpecialtyUz || 'Artist',
          specialty_ru: newArtistSpecialtyRu || newArtistSpecialtyUz || 'Художник',
          bio_uz: newArtistBioUz,
          bio_en: newArtistBioEn || newArtistBioUz,
          bio_ru: newArtistBioRu || newArtistBioUz,
          category_id: newArtistCategoryId || null,
        }),
      });
      const data = await res.json();
      if (data.success && data.artist) {
        setArtistsList((prev) => [data.artist, ...prev]);
        setArtistId(data.artist.id);
        if (data.artist.category_id) {
          setTopCategoryId(data.artist.category_id);
          const children = categoriesList.filter((c: any) => c.parent_id === data.artist.category_id);
          setCategoryId(children[0]?.id || data.artist.category_id);
        }
        setShowAddArtistModal(false);
        setNewArtistName('');
        setNewArtistSpecialtyUz('');
        setNewArtistSpecialtyEn('');
        setNewArtistSpecialtyRu('');
        setNewArtistBioUz('');
        setNewArtistBioEn('');
        setNewArtistBioRu('');
        setNewArtistCategoryId('');
      }
    } catch {
      alert('Rassom qo\'shishda xatolik yuz berdi');
    } finally {
      setAddingArtist(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryNameUz.trim() && !newCategoryNameEn.trim()) return;
    setAddingCategory(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name_uz: newCategoryNameUz || newCategoryNameEn,
          name_en: newCategoryNameEn || newCategoryNameUz,
          name_ru: newCategoryNameRu || newCategoryNameUz,
          slug: newCategorySlug.trim() || slugify(newCategoryNameUz || newCategoryNameEn),
          parent_id: newCategoryParentId || null,
        }),
      });
      const data = await res.json();
      if (data.success && data.category) {
        setCategoriesList((prev) => [...prev, data.category]);
        setCategoryId(data.category.id);
        setTopCategoryId(data.category.parent_id || data.category.id);
        setShowAddCategoryModal(false);
        setNewCategoryNameUz('');
        setNewCategoryNameEn('');
        setNewCategoryNameRu('');
        setNewCategorySlug('');
        setNewCategorySlugManual(false);
      }
    } catch {
      alert('Kategoriya qo\'shishda xatolik yuz berdi');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formattedSize = `${sizeWidth} × ${sizeHeight} ${sizeUnit}`;

    const payload = {
      title_uz: titleUz || titleEn,
      title_en: titleEn || titleUz,
      title_ru: titleRu || titleUz || titleEn,
      description_uz: descriptionUz,
      description_en: descriptionEn || descriptionUz,
      description_ru: descriptionRu || descriptionUz,
      size: formattedSize,
      technique_uz: techniqueUz || techniqueEn,
      technique_en: techniqueEn || techniqueUz,
      technique_ru: techniqueRu || techniqueUz || techniqueEn,
      year: parseInt(String(year)),
      artist_id: artistId,
      category_id: categoryId,
      price: parseFloat(String(price)),
      discount_price: calculatedDiscountPrice,
      discount_starts_at: discountStarts ? new Date(discountStarts) : null,
      discount_ends_at: discountEnds ? new Date(discountEnds) : null,
      is_sold: isSold,
      is_featured: isFeatured,
      images: JSON.stringify(images.length > 0 ? images : ['/assets/p-arch.svg']),
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
        setMessage('Kartina muvaffaqiyatli saqlandi!');
        setTimeout(() => {
          router.push('/admin/paintings');
        }, 1000);
      } else {
        setMessage(data.error || 'Kartinani saqlashda xatolik yuz berdi.');
      }
    } catch {
      setMessage('Serverga bog\'lanishda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePainting = async () => {
    if (!initialData?.id) return;
    if (!confirm(`"${titleEn || 'Ushbu'}" kartinani o'chirishni tasdiqlaysizmi?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/paintings/${initialData.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/paintings');
      } else {
        alert('O\'chirishda xatolik yuz berdi.');
      }
    } catch {
      alert('Serverga bog\'lanishda xatolik.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top action header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#E7E0D8]">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/paintings"
              className="p-1.5 text-[#726861] hover:text-[#BA4E25] rounded hover:bg-[#FAF4EC]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="font-serif text-2xl font-semibold text-[#281C18]">
              {isNew ? 'Yangi Kartina Qo\'shish' : `Tahrirlash — ${titleEn || 'Registon at Dusk'}`}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {!isNew && (
              <button
                type="button"
                onClick={handleDeletePainting}
                disabled={loading}
                className="px-3.5 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-[3px] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>O'chirish</span>
              </button>
            )}
            <Link
              href="/admin/paintings"
              className="px-4 py-2 border border-[#E7E0D8] bg-white text-xs font-semibold text-[#554740] rounded-[3px] hover:bg-[#FAF4EC] transition-colors"
            >
              Bekor qilish
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#BA4E25] hover:bg-[#9C3E1B] text-white text-xs font-semibold rounded-[3px] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saqlanmoqda...' : 'Saqlash'}</span>
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
                ASOSIY MA'LUMOTLAR
              </h3>

              {/* Sarlavhalar (3 tilda) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    SARLAVHA (UZ) *
                    {translatingGroup === 'title' && <Languages className="w-3 h-3 text-[#BA4E25] animate-pulse" />}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleUz}
                    onChange={(e) => setTitleUz(e.target.value)}
                    onBlur={(e) => autoTranslate('title', 'uz', e.target.value)}
                    placeholder="Registon shafaq paytida"
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    SARLAVHA (EN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Registon at Dusk"
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    SARLAVHA (RU)
                  </label>
                  <input
                    type="text"
                    value={titleRu}
                    onChange={(e) => setTitleRu(e.target.value)}
                    onBlur={(e) => autoTranslate('title', 'ru', e.target.value)}
                    placeholder="Регистан на закате"
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
                  />
                </div>
              </div>

              {/* Tavsiflar (3 tilda) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    TAVSIF (UZ)
                    {translatingGroup === 'description' && <Languages className="w-3 h-3 text-[#BA4E25] animate-pulse" />}
                  </label>
                  <textarea
                    rows={3}
                    value={descriptionUz}
                    onChange={(e) => setDescriptionUz(e.target.value)}
                    onBlur={(e) => autoTranslate('description', 'uz', e.target.value)}
                    placeholder="San'at asari haqida ma'lumot (O'zbekcha)..."
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    TAVSIF (EN)
                  </label>
                  <textarea
                    rows={3}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="Artwork description in English..."
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    TAVSIF (RU)
                  </label>
                  <textarea
                    rows={3}
                    value={descriptionRu}
                    onChange={(e) => setDescriptionRu(e.target.value)}
                    onBlur={(e) => autoTranslate('description', 'ru', e.target.value)}
                    placeholder="Описание картины на русском..."
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25] resize-none"
                  />
                </div>
              </div>

              {/* Texnikalar (3 tilda) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    TEXNIKA (UZ)
                    {translatingGroup === 'technique' && <Languages className="w-3 h-3 text-[#BA4E25] animate-pulse" />}
                  </label>
                  <input
                    type="text"
                    value={techniqueUz}
                    onChange={(e) => setTechniqueUz(e.target.value)}
                    onBlur={(e) => autoTranslate('technique', 'uz', e.target.value)}
                    placeholder="Moybo'yoq, polotno"
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    TEXNIKA (EN)
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
                    TEXNIKA (RU)
                  </label>
                  <input
                    type="text"
                    value={techniqueRu}
                    onChange={(e) => setTechniqueRu(e.target.value)}
                    onBlur={(e) => autoTranslate('technique', 'ru', e.target.value)}
                    placeholder="Холст, масло"
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
                  />
                </div>
              </div>

              {/* Structured Size + Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Structured Size Input (TZ Section 8.2) */}
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    O'LCHAMI (ENI × BO'YI) *
                  </label>
                  <div className="flex items-center gap-1.5 bg-white border border-[#E7E0D8] rounded-[3px] px-2 py-1">
                    <input
                      type="number"
                      min="1"
                      required
                      value={sizeWidth}
                      onChange={(e) => setSizeWidth(parseInt(e.target.value) || 0)}
                      placeholder="60"
                      className="w-14 text-xs font-semibold text-center focus:outline-none"
                    />
                    <span className="text-[#8F7E73] text-xs font-bold">×</span>
                    <input
                      type="number"
                      min="1"
                      required
                      value={sizeHeight}
                      onChange={(e) => setSizeHeight(parseInt(e.target.value) || 0)}
                      placeholder="80"
                      className="w-14 text-xs font-semibold text-center focus:outline-none"
                    />
                    <select
                      value={sizeUnit}
                      onChange={(e) => setSizeUnit(e.target.value)}
                      className="text-[11px] bg-transparent font-medium text-[#BA4E25] focus:outline-none ml-auto border-l pl-1 border-[#E7E0D8]"
                    >
                      <option value="sm">sm</option>
                      <option value="dyum">dyum</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-[#8F7E73] mt-0.5 block">
                    Natija: {sizeWidth} × {sizeHeight} {sizeUnit}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    YIL
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value) || 2024)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
                  />
                </div>
              </div>

              {/* Artist and Category with Inline "+ Yangi qo'shish" Modals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Artist Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase">
                      RASSOM (ARTIST) *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddArtistModal(true)}
                      className="text-[11px] font-semibold text-[#BA4E25] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Yangi qo'shish</span>
                    </button>
                  </div>
                  <select
                    value={artistId}
                    onChange={(e) => {
                      const newArtistId = e.target.value;
                      setArtistId(newArtistId);
                      // Rassomga biriktirilgan ota-kategoriya (yo'nalishi)
                      // bo'lsa, ota-kategoriyani avtomatik shunga o'rnatamiz
                      // — bola-kategoriyani admin qo'lda tanlaydi.
                      const chosenArtist: any = artistsList.find((a: any) => a.id === newArtistId);
                      if (chosenArtist?.category_id) {
                        setTopCategoryId(chosenArtist.category_id);
                        const children = categoriesList.filter((c: any) => c.parent_id === chosenArtist.category_id);
                        setCategoryId(children[0]?.id || chosenArtist.category_id);
                      }
                    }}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
                  >
                    {artistsList.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Selector — ota (product type) then bola (subject) */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase">
                        OTA-KATEGORIYA (MAHSULOT TURI) *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowAddCategoryModal(true)}
                        className="text-[11px] font-semibold text-[#BA4E25] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Yangi qo'shish</span>
                      </button>
                    </div>
                    <select
                      value={topCategoryId}
                      onChange={(e) => {
                        const newTopId = e.target.value;
                        setTopCategoryId(newTopId);
                        const children = categoriesList.filter((c: any) => c.parent_id === newTopId);
                        // A top-level category with no subjects under it (e.g.
                        // "Kulolchilik") is used directly as the painting's category.
                        setCategoryId(children[0]?.id || newTopId);
                      }}
                      className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
                    >
                      {categoriesList
                        .filter((c: any) => !c.parent_id)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name_uz || c.name_en}
                          </option>
                        ))}
                    </select>
                  </div>

                  {(() => {
                    const children = categoriesList.filter((c: any) => c.parent_id === topCategoryId);
                    if (children.length === 0) return null;
                    return (
                      <div>
                        <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                          BOLA-KATEGORIYA (MAVZU) *
                        </label>
                        <select
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
                        >
                          {children.map((c: any) => (
                            <option key={c.id} value={c.id}>
                              {c.name_uz || c.name_en}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Images Upload Box */}
            <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold tracking-wider text-[#BA4E25] uppercase">
                  RASMLAR (IMAGES)
                </h3>
                <span className="text-[11px] text-[#8F7E73]">
                  {images.length} ta rasm yuklangan
                </span>
              </div>

              {/* Gallery of Uploaded Images */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-4/3 rounded border border-[#E7E0D8] overflow-hidden bg-white group"
                    >
                      <Image
                        src={img}
                        alt="Painting asset"
                        fill
                        className="object-cover"
                      />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-[#BA4E25] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Asosiy
                        </span>
                      )}
                      <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => setAiEditIndex(idx)}
                          title="AI bilan fon yaratish"
                          className="p-1 bg-black/60 text-white rounded hover:bg-[#BA4E25]"
                        >
                          <Sparkles className="w-3 h-3" />
                        </button>
                        {images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                            className="p-1 bg-black/60 text-white rounded hover:bg-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Dropzone */}
              <label className="border-2 border-dashed border-[#D2C5BA] rounded-[4px] p-6 text-center bg-[#FAF4EC]/40 hover:bg-[#FAF4EC] transition-colors cursor-pointer flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
                {uploadingImage ? (
                  <div className="flex items-center gap-2 text-xs text-[#BA4E25]">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Rasm yuklanmoqda...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-7 h-7 text-[#8F8178] mb-1.5" />
                    <p className="text-xs font-semibold text-[#554740]">
                      Kompyuterdan rasm tanlash yoki sudrab tashlash
                    </p>
                    <span className="text-[10px] text-[#A8988E] mt-0.5">
                      JPG, PNG, WEBP formatlar (birinchi rasm muqova sifatida qo'llanadi)
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Right Column (Pricing & Toggles) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Pricing Panel */}
            <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 space-y-4">
              <h3 className="text-xs font-bold tracking-wider text-[#BA4E25] uppercase">
                NARX VA CHEGIRMA
              </h3>

              <div>
                <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                  ASOSIY NARX (USD) *
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  placeholder="420"
                  className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              {/* Scope selection pills */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1.5">
                  CHEGIRMA DARAJASI (HIERARCHY)
                </label>
                <div className="grid grid-cols-3 gap-1 bg-[#FAF4EC] p-1 rounded-[3px] border border-[#E7E0D8]">
                  {(
                    [
                      { id: 'PAINTING', label: 'Ushbu kartina' },
                      { id: 'ARTIST', label: 'Rassom' },
                      { id: 'CATEGORY', label: 'Kategoriya' },
                    ] as const
                  ).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setDiscountScope(s.id)}
                      className={`text-[10px] font-semibold py-1.5 rounded-[2px] transition-all cursor-pointer ${
                        discountScope === s.id
                          ? 'bg-white text-[#BA4E25] shadow-xs'
                          : 'text-[#8F8178] hover:text-[#281C18]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    CHEGIRMA %
                  </label>
                  <input
                    type="text"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    placeholder="15%"
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    YAKUNIY NARX
                  </label>
                  <div className="text-sm font-bold text-[#BA4E25] py-2">
                    ${calculatedDiscountPrice || price}
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-3 pt-2 border-t border-[#E7E0D8]">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#8F8178] uppercase mb-1">
                    BOSHLANISH SANASI
                  </label>
                  <input
                    type="date"
                    value={discountStarts}
                    onChange={(e) => setDiscountStarts(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 bg-white border border-[#E7E0D8] rounded-[3px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-[#8F8178] uppercase mb-1">
                    TUGASH SANASI
                  </label>
                  <input
                    type="date"
                    value={discountEnds}
                    onChange={(e) => setDiscountEnds(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 bg-white border border-[#E7E0D8] rounded-[3px]"
                  />
                </div>
              </div>
            </div>

            {/* Toggles Panel */}
            <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 space-y-4">
              <h3 className="text-xs font-bold tracking-wider text-[#BA4E25] uppercase">
                HOLATI VA KO'RINIShI
              </h3>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-[#281C18]">Sotilgan (Sold)</div>
                  <div className="text-[10px] text-[#8F8178]">
                    Kartina saytda "Sotildi" belgisi bilan ko'rinadi
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isSold}
                  onChange={(e) => setIsSold(e.target.checked)}
                  className="w-4 h-4 accent-[#BA4E25]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-[#E7E0D8]">
                <div>
                  <div className="text-xs font-semibold text-[#281C18]">Bosh sahifada (Featured)</div>
                  <div className="text-[10px] text-[#8F8178]">
                    Bosh sahifadagi tanlangan asarlar qatorida ko'rsatish
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#BA4E25]"
                />
              </label>
            </div>
          </div>
        </div>
      </form>

      {/* Modal: Inline Add Artist */}
      {showAddArtistModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#E7E0D8]">
            <div className="flex items-center justify-between border-b pb-3 border-[#E7E0D8]">
              <h3 className="font-serif text-lg font-bold text-[#281C18]">
                Yangi Rassom Qo'shish
              </h3>
              <button
                type="button"
                onClick={() => setShowAddArtistModal(false)}
                className="text-[#8F8178] hover:text-[#281C18]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateArtist} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1">
                  Rassom Ism-Sharifi *
                </label>
                <input
                  type="text"
                  required
                  value={newArtistName}
                  onChange={(e) => setNewArtistName(e.target.value)}
                  placeholder="Kamoliddin Behzod"
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1">
                  Ota-kategoriya (yo'nalishi)
                </label>
                <select
                  value={newArtistCategoryId}
                  onChange={(e) => setNewArtistCategoryId(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25] bg-white"
                >
                  <option value="">— Belgilanmagan —</option>
                  {topLevelCategoryOptions.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name_uz}
                    </option>
                  ))}
                </select>
                <p className="text-[10.5px] text-[#8F7E73] mt-1">
                  Bu rassom keyingi kartinalarga tanlanganda ota-kategoriya avtomatik shunga o'rnatiladi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B5E55] mb-1">
                    Mutaxassisligi (UZ)
                  </label>
                  <input
                    type="text"
                    value={newArtistSpecialtyUz}
                    onChange={(e) => setNewArtistSpecialtyUz(e.target.value)}
                    onBlur={(e) => autoTranslate('newArtistSpecialty', 'uz', e.target.value)}
                    placeholder="Miniatyura ustasi"
                    className="w-full text-xs px-2.5 py-1.5 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-[11px] font-bold text-[#6B5E55] mb-1">
                    Mutaxassisligi (EN)
                    {translatingGroup === 'newArtistSpecialty' && <Languages className="w-3 h-3 text-[#BA4E25] animate-pulse" />}
                  </label>
                  <input
                    type="text"
                    value={newArtistSpecialtyEn}
                    onChange={(e) => setNewArtistSpecialtyEn(e.target.value)}
                    placeholder="Miniature Artist"
                    className="w-full text-xs px-2.5 py-1.5 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B5E55] mb-1">
                    Mutaxassisligi (RU)
                  </label>
                  <input
                    type="text"
                    value={newArtistSpecialtyRu}
                    onChange={(e) => setNewArtistSpecialtyRu(e.target.value)}
                    placeholder="Мастер миниатюры"
                    className="w-full text-xs px-2.5 py-1.5 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B5E55] mb-1">
                    Tarjimai Hol (Bio - UZ)
                  </label>
                  <textarea
                    rows={2}
                    value={newArtistBioUz}
                    onChange={(e) => setNewArtistBioUz(e.target.value)}
                    onBlur={(e) => autoTranslate('newArtistBio', 'uz', e.target.value)}
                    placeholder="Rassom ijodi haqida o'zbekcha..."
                    className="w-full text-xs px-2.5 py-1.5 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25] resize-none"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-[11px] font-bold text-[#6B5E55] mb-1">
                    Tarjimai Hol (Bio - EN)
                    {translatingGroup === 'newArtistBio' && <Languages className="w-3 h-3 text-[#BA4E25] animate-pulse" />}
                  </label>
                  <textarea
                    rows={2}
                    value={newArtistBioEn}
                    onChange={(e) => setNewArtistBioEn(e.target.value)}
                    placeholder="Artist bio in English..."
                    className="w-full text-xs px-2.5 py-1.5 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B5E55] mb-1">
                    Tarjimai Hol (Bio - RU)
                  </label>
                  <textarea
                    rows={2}
                    value={newArtistBioRu}
                    onChange={(e) => setNewArtistBioRu(e.target.value)}
                    placeholder="Биография на русском..."
                    className="w-full text-xs px-2.5 py-1.5 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25] resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddArtistModal(false)}
                  className="px-4 py-2 border border-[#E7E0D8] text-xs font-semibold text-[#554740] rounded hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={addingArtist}
                  className="px-4 py-2 bg-[#BA4E25] text-white text-xs font-semibold rounded hover:bg-[#9C3E1B] disabled:opacity-50"
                >
                  {addingArtist ? 'Qo\'shilmoqda...' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Inline Add Category */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#E7E0D8]">
            <div className="flex items-center justify-between border-b pb-3 border-[#E7E0D8]">
              <h3 className="font-serif text-lg font-bold text-[#281C18]">
                Yangi Kategoriya Qo'shish
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCategoryModal(false)}
                className="text-[#8F8178] hover:text-[#281C18]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1">
                  Kategoriya Nomi (O'zbekcha) *
                </label>
                <input
                  type="text"
                  required
                  value={newCategoryNameUz}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewCategoryNameUz(val);
                    if (!newCategorySlugManual) {
                      setNewCategorySlug(slugify(val));
                    }
                  }}
                  onBlur={(e) => autoTranslate('newCategoryName', 'uz', e.target.value)}
                  placeholder="Ipak yo'li manzaralari"
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#6B5E55] mb-1">
                  Kategoriya Nomi (Inglizcha - EN)
                  {translatingGroup === 'newCategoryName' && <Languages className="w-3 h-3 text-[#BA4E25] animate-pulse" />}
                </label>
                <input
                  type="text"
                  value={newCategoryNameEn}
                  onChange={(e) => setNewCategoryNameEn(e.target.value)}
                  placeholder="Silk Road Landscapes"
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1">
                  Kategoriya Nomi (Ruscha - RU)
                </label>
                <input
                  type="text"
                  value={newCategoryNameRu}
                  onChange={(e) => setNewCategoryNameRu(e.target.value)}
                  placeholder="Пейзажи Шелкового пути"
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1">
                  Ota-kategoriya (mahsulot turi)
                </label>
                <select
                  value={newCategoryParentId}
                  onChange={(e) => setNewCategoryParentId(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25] bg-white"
                >
                  <option value="">— Yuqori daraja (o'zi mahsulot turi) —</option>
                  {topLevelCategoryOptions.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name_uz}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#6B5E55]">
                    Slug (URL identifikatori)
                  </label>
                  {!newCategorySlugManual ? (
                    <span className="text-[10px] text-[#429599] font-medium">
                      (Avtomatik)
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#BA4E25] font-medium">
                      (Qo'lda)
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={newCategorySlug}
                  onChange={(e) => {
                    setNewCategorySlugManual(true);
                    setNewCategorySlug(e.target.value);
                  }}
                  placeholder="ipak-yoli-manzaralari"
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25] font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 border border-[#E7E0D8] text-xs font-semibold text-[#554740] rounded hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={addingCategory}
                  className="px-4 py-2 bg-[#BA4E25] text-white text-xs font-semibold rounded hover:bg-[#9C3E1B] disabled:opacity-50"
                >
                  {addingCategory ? 'Qo\'shilmoqda...' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: AI Background Generation (Gemini) */}
      {aiEditIndex !== null && (
        <AiBackgroundModal
          originalImage={images[aiEditIndex]}
          onClose={() => setAiEditIndex(null)}
          onAccept={(newImageUrl) => {
            setImages((prev) => {
              const next = [...prev];
              next.splice(aiEditIndex + 1, 0, newImageUrl);
              return next;
            });
            setAiEditIndex(null);
          }}
        />
      )}

      {/* Modal: Crop tool, shown right after picking a file */}
      {pendingCropFile && (
        <ImageCropModal
          file={pendingCropFile}
          onCancel={() => setPendingCropFile(null)}
          onCropped={(croppedFile) => {
            setPendingCropFile(null);
            uploadFile(croppedFile);
          }}
          onSkip={(originalFile) => {
            setPendingCropFile(null);
            uploadFile(originalFile);
          }}
        />
      )}
    </>
  );
}
