'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Pencil, X, MapPin, Languages, Building2 } from 'lucide-react';

interface BranchItem {
  id: string;
  name_uz: string;
  name_en: string;
  name_ru: string;
  address: string;
  location_map: string;
  phone: string | null;
  working_hours: string | null;
  order: number;
}

export default function AdminBranchesClient({
  initialBranches,
}: {
  initialBranches: BranchItem[];
}) {
  const [branches, setBranches] = useState<BranchItem[]>(initialBranches);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchItem | null>(null);

  const [nameUz, setNameUz] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [address, setAddress] = useState('');
  const [locationMap, setLocationMap] = useState('');
  const [phone, setPhone] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [order, setOrder] = useState('0');
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);

  const autoTranslateName = async (text: string) => {
    if (!text.trim()) return;
    setTranslating(true);
    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sourceLang: 'uz' }),
      });
      const data = await res.json();
      if (data.success && data.translations) {
        setNameEn((prev) => (prev.trim() ? prev : data.translations.en || prev));
        setNameRu((prev) => (prev.trim() ? prev : data.translations.ru || prev));
      }
    } catch {
      // Silent failure — auto-translation is a convenience, not required to save.
    } finally {
      setTranslating(false);
    }
  };

  const resetForm = () => {
    setEditingBranch(null);
    setNameUz('');
    setNameEn('');
    setNameRu('');
    setAddress('');
    setLocationMap('');
    setPhone('');
    setWorkingHours('');
    setOrder(String(branches.length));
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (b: BranchItem) => {
    setEditingBranch(b);
    setNameUz(b.name_uz || '');
    setNameEn(b.name_en || '');
    setNameRu(b.name_ru || '');
    setAddress(b.address || '');
    setLocationMap(b.location_map || '');
    setPhone(b.phone || '');
    setWorkingHours(b.working_hours || '');
    setOrder(String(b.order ?? 0));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameUz.trim() && !nameEn.trim()) return;
    if (!address.trim()) return;

    setLoading(true);
    try {
      const payload = {
        name_uz: nameUz || nameEn,
        name_en: nameEn || nameUz,
        name_ru: nameRu || nameUz,
        address: address.trim(),
        location_map: locationMap.trim(),
        phone: phone.trim() || null,
        working_hours: workingHours.trim() || null,
        order: Number(order) || 0,
      };

      if (editingBranch) {
        const res = await fetch(`/api/admin/branches/${editingBranch.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.branch) {
          setBranches((prev) =>
            prev
              .map((b) => (b.id === editingBranch.id ? data.branch : b))
              .sort((a, b) => a.order - b.order)
          );
          setIsModalOpen(false);
        } else {
          alert(data.error || 'Filialni yangilashda xatolik');
        }
      } else {
        const res = await fetch('/api/admin/branches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.branch) {
          setBranches((prev) => [...prev, data.branch].sort((a, b) => a.order - b.order));
          setIsModalOpen(false);
        } else {
          alert(data.error || "Filial qo'shishda xatolik yuz berdi");
        }
      }
    } catch {
      alert("Serverga bog'lanishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" filialini o'chirishni tasdiqlaysizmi?`)) return;

    try {
      const res = await fetch(`/api/admin/branches/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBranches((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert("O'chirishda xatolik yuz berdi.");
      }
    } catch {
      alert("Serverga bog'lanishda xatolik.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#281C18]">
            Filiallar Boshqaruvi
          </h2>
          <p className="text-xs text-[#726861] mt-0.5">
            Galereyaning barcha filiallari — har biri o'z manzili va xarita havolasi bilan Kontakt sahifasida ko'rsatiladi.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#BA4E25] hover:bg-[#9C3E1B] text-white text-xs font-semibold rounded-[3px] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Filial qo'shish</span>
        </button>
      </div>

      <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF4EC] border-b border-[#E7E0D8] text-[#8F8178] font-bold tracking-wider uppercase text-[10.5px]">
              <th className="py-3 px-4">NOMI</th>
              <th className="py-3 px-4">MANZIL</th>
              <th className="py-3 px-4">TELEFON</th>
              <th className="py-3 px-4">ISH VAQTI</th>
              <th className="py-3 px-4 text-right">AMALLAR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1]">
            {branches.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 px-4 text-center text-[#8F8178]">
                  Hali filial qo'shilmagan. "Filial qo'shish" bilan boshlang.
                </td>
              </tr>
            )}
            {branches.map((b) => (
              <tr key={b.id} className="hover:bg-[#FAF4EC]/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-[#281C18]">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#C8B8AB] shrink-0" />
                    {b.name_uz}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-[#554740]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8F8178] shrink-0" />
                    {b.address}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-[#554740]">{b.phone || '—'}</td>
                <td className="py-3.5 px-4 text-[#554740]">{b.working_hours || '—'}</td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEditModal(b)}
                      className="p-1.5 text-[#554740] hover:text-[#BA4E25] hover:bg-white rounded transition-colors cursor-pointer"
                      title="Tahrirlash"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id, b.name_uz || b.name_en)}
                      className="p-1.5 text-[#8F7E73] hover:text-red-600 hover:bg-white rounded transition-colors cursor-pointer"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#E7E0D8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-[#E7E0D8]">
              <h3 className="font-serif text-lg font-bold text-[#281C18]">
                {editingBranch ? 'Filialni Tahrirlash' : 'Yangi Filial'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#8F7E73] hover:text-[#281C18]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1">
                  Filial Nomi (O'zbekcha) *
                </label>
                <input
                  type="text"
                  required
                  value={nameUz}
                  onChange={(e) => setNameUz(e.target.value)}
                  onBlur={(e) => autoTranslateName(e.target.value)}
                  placeholder="Bosh filial — Eski shahar"
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#6B5E55] mb-1">
                  Filial Nomi (Inglizcha - EN)
                  {translating && <Languages className="w-3 h-3 text-[#BA4E25] animate-pulse" />}
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="Main Branch — Old City"
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#6B5E55] mb-1">
                  Filial Nomi (Ruscha - RU)
                  {translating && <Languages className="w-3 h-3 text-[#BA4E25] animate-pulse" />}
                </label>
                <input
                  type="text"
                  value={nameRu}
                  onChange={(e) => setNameRu(e.target.value)}
                  placeholder="Главный филиал — Старый город"
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1">
                  Manzil (matn) *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Barakhon Madrasah, Tashkent, Uzbekistan"
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1">
                  Xarita havolasi (Google Maps)
                </label>
                <input
                  type="text"
                  value={locationMap}
                  onChange={(e) => setLocationMap(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1">
                  Telefon raqami
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1">
                  Ish vaqti (matn)
                </label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="Dush - Yaksh: 09:00 - 19:00"
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1">
                  Tartib raqami (kichigi birinchi ko'rsatiladi)
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E7E0D8] text-xs font-semibold text-[#554740] rounded hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#BA4E25] text-white text-xs font-semibold rounded hover:bg-[#9C3E1B] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Saqlanmoqda...' : editingBranch ? 'Saqlash' : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
