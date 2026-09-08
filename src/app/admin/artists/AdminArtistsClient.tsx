'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, X, Loader2 } from 'lucide-react';

interface ArtistItem {
  id: string;
  name: string;
  initials?: string | null;
  specialty_en: string;
  specialty_uz?: string;
  bio_en: string;
  bio_uz?: string;
  _count: { paintings: number };
}

export default function AdminArtistsClient({
  initialArtists,
}: {
  initialArtists: ArtistItem[];
}) {
  const [artists, setArtists] = useState<ArtistItem[]>(initialArtists);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          specialty_uz: specialty || 'Rassom',
          specialty_en: specialty || 'Painter',
          bio_uz: bio,
          bio_en: bio,
        }),
      });

      const data = await res.json();
      if (data.success && data.artist) {
        setArtists((prev) => [
          { ...data.artist, _count: { paintings: 0 } },
          ...prev,
        ]);
        setShowModal(false);
        setName('');
        setSpecialty('');
        setBio('');
      } else {
        alert(data.error || 'Rassom qo\'shishda xatolik yuz berdi');
      }
    } catch {
      alert('Serverga bog\'lanishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, artistName: string) => {
    if (!confirm(`"${artistName}" rassomini o'chirishni tasdiqlaysizmi?`)) return;

    try {
      const res = await fetch(`/api/admin/artists/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArtists((prev) => prev.filter((a) => a.id !== id));
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
            Rassomlar Boshqaruvi
          </h2>
          <p className="text-xs text-[#726861] mt-0.5">
            Galereyada ro'yxatdan o'tgan ustalar va rassomlar ro'yxati
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#BA4E25] hover:bg-[#9C3E1B] text-white text-xs font-semibold rounded-[3px] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Rassom Qo'shish</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((a) => (
          <div
            key={a.id}
            className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 space-y-4 shadow-xs relative group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#BA4E25] text-white font-serif font-bold text-lg flex items-center justify-center">
                  {a.initials || a.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-lg text-[#281C18]">
                    {a.name}
                  </h3>
                  <span className="text-[10.5px] font-bold tracking-wider text-[#429599] uppercase">
                    {a.specialty_uz || a.specialty_en}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(a.id, a.name)}
                className="p-1.5 text-[#8F7E73] hover:text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="O'chirish"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#5F534C] leading-relaxed line-clamp-3">
              {a.bio_uz || a.bio_en}
            </p>

            <div className="pt-2 border-t border-[#F0EAE1] flex items-center justify-between text-xs text-[#726861]">
              <span>
                Asarlar soni: <strong className="text-[#281C18]">{a._count?.paintings || 0}</strong>
              </span>
              <Link
                href={`/admin/paintings?artist=${a.id}`}
                className="text-[#BA4E25] font-semibold hover:underline"
              >
                Kartinalarni ko'rish →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#E7E0D8]">
            <div className="flex items-center justify-between border-b pb-3 border-[#E7E0D8]">
              <h3 className="font-serif text-lg font-bold text-[#281C18]">
                Yangi Rassom Qo'shish
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
                  Rassom Ism-Sharifi *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kamoliddin Behzod"
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1">
                  Mutaxassisligi (Specialty)
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="Minyatura va Sharq manzaralari"
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E55] mb-1">
                  Tarjimai Hol (Bio)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Rassom hayoti va ijodiy yo'li..."
                  className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25] resize-none"
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
