'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, X } from 'lucide-react';

interface CategoryItem {
  id: string;
  slug: string;
  name_en: string;
  name_ru: string;
  name_uz: string;
  _count: { paintings: number };
}

export default function AdminCategoriesClient({
  initialCategories,
}: {
  initialCategories: CategoryItem[];
}) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [nameUz, setNameUz] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameUz.trim() && !nameEn.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name_uz: nameUz || nameEn,
          name_en: nameEn || nameUz,
          name_ru: nameRu || nameUz,
        }),
      });

      const data = await res.json();
      if (data.success && data.category) {
        setCategories((prev) => [
          ...prev,
          { ...data.category, _count: { paintings: 0 } },
        ]);
        setShowModal(false);
        setNameUz('');
        setNameEn('');
        setNameRu('');
      } else {
        alert(data.error || 'Kategoriya qo\'shishda xatolik yuz berdi');
      }
    } catch {
      alert('Serverga bog\'lanishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" kategoriyasini o'chirishni tasdiqlaysizmi?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert('O\'chirishda xatolik yuz berdi.');
      }
    } catch {
      alert('Serverga bog\'lanishda xatolik.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#281C18]">
            Kategoriyalar Boshqaruvi
          </h2>
          <p className="text-xs text-[#726861] mt-0.5">
            Galereya janrlari va mavzulari (saytdagi filtrlar uchun)
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#BA4E25] hover:bg-[#9C3E1B] text-white text-xs font-semibold rounded-[3px] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Kategoriya Qo'shish</span>
        </button>
      </div>

      <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF4EC] border-b border-[#E7E0D8] text-[#8F8178] font-bold tracking-wider uppercase text-[10.5px]">
              <th className="py-3 px-4">NOMI (UZ)</th>
              <th className="py-3 px-4">NOMI (EN)</th>
              <th className="py-3 px-4">NOMI (RU)</th>
              <th className="py-3 px-4">SLUG</th>
              <th className="py-3 px-4 text-center">ASARLAR SONI</th>
              <th className="py-3 px-4 text-right">AMALLAR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1]">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-[#FAF4EC]/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-[#281C18]">
                  {c.name_uz}
                </td>
                <td className="py-3.5 px-4 text-[#554740]">{c.name_en}</td>
                <td className="py-3.5 px-4 text-[#554740]">{c.name_ru}</td>
                <td className="py-3.5 px-4 font-mono text-[#8F8178]">{c.slug}</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#BA4E25]">
                  {c._count?.paintings || 0}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => handleDelete(c.id, c.name_uz || c.name_en)}
                    className="p-1.5 text-[#8F7E73] hover:text-red-600 rounded transition-colors cursor-pointer"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#E7E0D8]">
            <div className="flex items-center justify-between border-b pb-3 border-[#E7E0D8]">
              <h3 className="font-serif text-lg font-bold text-[#281C18]">
                Yangi Kategoriya Qo'shish
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#8F7E73] hover:text-[#281C18]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1">
                  Kategoriya Nomi (O'zbekcha) *
                </label>
                <input
                  type="text"
                  required
                  value={nameUz}
                  onChange={(e) => setNameUz(e.target.value)}
                  placeholder="Ipak yo'li manzaralari"
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1">
                  Kategoriya Nomi (Inglizcha - EN)
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
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
                  value={nameRu}
                  onChange={(e) => setNameRu(e.target.value)}
                  placeholder="Пейзажи Шелкового пути"
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#E7E0D8] text-xs font-semibold text-[#554740] rounded hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#BA4E25] text-white text-xs font-semibold rounded hover:bg-[#9C3E1B] disabled:opacity-50"
                >
                  {loading ? 'Qo\'shilmoqda...' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
