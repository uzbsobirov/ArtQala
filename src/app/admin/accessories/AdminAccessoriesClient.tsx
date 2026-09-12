'use client';

import React, { useState } from 'react';
import { Gem, Plus, Trash2, Pencil, X, Check } from 'lucide-react';

interface CategoryLite {
  id: string;
  name_en: string;
  name_ru: string;
  name_uz: string;
}

interface Accessory {
  id: string;
  name_en: string;
  name_ru: string;
  name_uz: string;
  price: number;
  is_active: boolean;
  categories: CategoryLite[];
}

interface AdminAccessoriesClientProps {
  initialAccessories: Accessory[];
  categories: CategoryLite[];
}

interface FormState {
  name_en: string;
  name_ru: string;
  name_uz: string;
  price: string;
  is_active: boolean;
  category_ids: string[];
}

const emptyForm: FormState = {
  name_en: '',
  name_ru: '',
  name_uz: '',
  price: '',
  is_active: true,
  category_ids: [],
};

export default function AdminAccessoriesClient({ initialAccessories, categories }: AdminAccessoriesClientProps) {
  const [accessories, setAccessories] = useState<Accessory[]>(initialAccessories);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (a: Accessory) => {
    setEditingId(a.id);
    setForm({
      name_en: a.name_en,
      name_ru: a.name_ru,
      name_uz: a.name_uz,
      price: String(a.price),
      is_active: a.is_active,
      category_ids: a.categories.map((c) => c.id),
    });
    setShowModal(true);
  };

  const toggleCategory = (id: string) => {
    setForm((prev) => ({
      ...prev,
      category_ids: prev.category_ids.includes(id)
        ? prev.category_ids.filter((c) => c !== id)
        : [...prev.category_ids, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/accessories/${editingId}` : '/api/admin/accessories';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        if (editingId) {
          setAccessories((prev) => prev.map((a) => (a.id === editingId ? data.accessory : a)));
        } else {
          setAccessories((prev) => [data.accessory, ...prev]);
        }
        setShowModal(false);
      } else {
        alert(data.error || 'Xatolik yuz berdi');
      }
    } catch {
      alert('Serverga bog\'lanishda xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ushbu mahsulotni o'chirishni tasdiqlaysizmi?")) return;
    try {
      const res = await fetch(`/api/admin/accessories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAccessories((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      alert("O'chirishda xatolik yuz berdi");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#281C18] flex items-center gap-2.5">
            <Gem className="w-6 h-6 text-[#BA4E25]" />
            Qo'shimcha mahsulotlar (Aksessuarlar)
          </h2>
          <p className="text-xs text-[#726861] mt-1">
            Mijozlar so'rov yuborayotganda tanlashi mumkin bo'lgan ixtiyoriy qo'shimcha xizmatlar (futlyar va h.k.).
            Kategoriya bo'yicha qaysi kartinalarga tegishli ekanini belgilaysiz.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#BA4E25] hover:bg-[#9C3E1B] text-white text-xs font-semibold rounded-[3px] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi qo'shish</span>
        </button>
      </div>

      {accessories.length === 0 ? (
        <div className="text-center py-16 bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] text-sm text-[#8F8178]">
          Hali qo'shimcha mahsulot qo'shilmagan.
        </div>
      ) : (
        <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E7E0D8] bg-[#FAF4EC]">
                <th className="px-5 py-3 text-[10.5px] font-bold tracking-wider text-[#6B5E55] uppercase">Nomi</th>
                <th className="px-5 py-3 text-[10.5px] font-bold tracking-wider text-[#6B5E55] uppercase">Narxi</th>
                <th className="px-5 py-3 text-[10.5px] font-bold tracking-wider text-[#6B5E55] uppercase">Kategoriyalar</th>
                <th className="px-5 py-3 text-[10.5px] font-bold tracking-wider text-[#6B5E55] uppercase">Holati</th>
                <th className="px-5 py-3 text-[10.5px] font-bold tracking-wider text-[#6B5E55] uppercase text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {accessories.map((a) => (
                <tr key={a.id} className="border-b border-[#F2ECE4] last:border-0">
                  <td className="px-5 py-3.5 text-sm font-semibold text-[#281C18]">{a.name_uz}</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-[#BA4E25]">${a.price}</td>
                  <td className="px-5 py-3.5 text-xs text-[#6E6057]">
                    {a.categories.length === 0
                      ? 'Barcha kategoriyalar'
                      : a.categories.map((c) => c.name_uz).join(', ')}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        a.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {a.is_active ? 'Faol' : "O'chirilgan"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => openEditModal(a)}
                      className="p-1.5 text-[#726861] hover:text-[#429599] cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="p-1.5 text-[#726861] hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl space-y-4 border border-[#E7E0D8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-[#E7E0D8]">
              <h3 className="font-serif text-lg font-bold text-[#281C18]">
                {editingId ? 'Mahsulotni tahrirlash' : "Yangi qo'shimcha mahsulot"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[#8F8178] hover:text-[#281C18]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B5E55] mb-1">Nomi (UZ) *</label>
                  <input
                    type="text"
                    required
                    value={form.name_uz}
                    onChange={(e) => setForm({ ...form, name_uz: e.target.value })}
                    placeholder="Himoya futlyari"
                    className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B5E55] mb-1">Nomi (EN) *</label>
                  <input
                    type="text"
                    required
                    value={form.name_en}
                    onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                    placeholder="Protective Case"
                    className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B5E55] mb-1">Nomi (RU)</label>
                  <input
                    type="text"
                    value={form.name_ru}
                    onChange={(e) => setForm({ ...form, name_ru: e.target.value })}
                    placeholder="Защитный чехол"
                    className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B5E55] mb-1">Narxi (USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="50"
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B5E55] mb-1.5">
                  Qaysi kategoriyalarga tegishli
                </label>
                <p className="text-[10.5px] text-[#8F8178] mb-2">
                  Hech birini belgilamasangiz — barcha kategoriyalarga tegishli bo'ladi.
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.map((cat) => {
                    const selected = form.category_ids.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded border transition-all text-left cursor-pointer ${
                          selected
                            ? 'bg-[#281C18] text-[#FAF4EC] border-[#281C18]'
                            : 'bg-white text-[#554740] border-[#E7E0D8] hover:border-[#BA4E25]'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3 shrink-0" />}
                        <span className="truncate">{cat.name_uz}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 accent-[#BA4E25]"
                />
                <span className="text-xs font-semibold text-[#281C18]">Faol (mijozlarga ko'rsatiladi)</span>
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E0D8]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#E7E0D8] text-xs font-semibold text-[#554740] rounded hover:bg-gray-50 cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#BA4E25] text-white text-xs font-semibold rounded hover:bg-[#9C3E1B] disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
