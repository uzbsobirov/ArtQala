'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Loader2, Globe, MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Fields
  const [galleryName, setGalleryName] = useState('Art Qala');
  const [phone, setPhone] = useState('+998 66 233 44 55');
  const [email, setEmail] = useState('info@artqala.uz');
  const [address, setAddress] = useState('Registan Street, 4, Samarkand, Uzbekistan');
  const [locationMap, setLocationMap] = useState('https://maps.google.com/?q=Registan,Samarkand');
  const [workingHours, setWorkingHours] = useState('Mon - Sun: 09:00 - 19:00');
  const [telegram, setTelegram] = useState('https://t.me/artqala');
  const [instagram, setInstagram] = useState('https://instagram.com/artqala');

  // About texts
  const [aboutUz, setAboutUz] = useState('');
  const [aboutEn, setAboutEn] = useState('');
  const [aboutRu, setAboutRu] = useState('');

  // Currency
  const [manualRates, setManualRates] = useState(false);
  const [rateUsd, setRateUsd] = useState('12850');
  const [rateEur, setRateEur] = useState('13900');
  const [rateRub, setRateRub] = useState('140');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.settings) {
          const s = data.settings;
          setGalleryName(s.gallery_name || 'Art Qala');
          setPhone(s.phone || '+998 66 233 44 55');
          setEmail(s.email || 'info@artqala.uz');
          setAddress(s.address || 'Registan Street, 4, Samarkand, Uzbekistan');
          setLocationMap(s.location_map || 'https://maps.google.com/?q=Registan,Samarkand');
          setWorkingHours(s.working_hours || 'Mon - Sun: 09:00 - 19:00');
          setTelegram(s.telegram || 'https://t.me/artqala');
          setInstagram(s.instagram || 'https://instagram.com/artqala');
          setAboutUz(s.about_uz || '');
          setAboutEn(s.about_en || '');
          setAboutRu(s.about_ru || '');
          setManualRates(Boolean(s.manual_rates));
          setRateUsd(String(s.rate_usd || 12850));
          setRateEur(String(s.rate_eur || 13900));
          setRateRub(String(s.rate_rub || 140));
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gallery_name: galleryName,
          phone,
          email,
          address,
          location_map: locationMap,
          working_hours: workingHours,
          telegram,
          instagram,
          about_uz: aboutUz,
          about_en: aboutEn,
          about_ru: aboutRu,
          manual_rates: manualRates,
          rate_usd: rateUsd,
          rate_eur: rateEur,
          rate_rub: rateRub,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError('Sozlamalarni saqlashda xatolik yuz berdi.');
      }
    } catch {
      setError('Serverga bog\'lanishda xatolik.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[#8F7E73]">
        <Loader2 className="w-6 h-6 animate-spin mr-2 text-[#BA4E25]" />
        <span className="text-xs">Sozlamalar yuklanmoqda...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#281C18]">
            Galereya Sozlamalari
          </h2>
          <p className="text-xs text-[#726861] mt-0.5">
            Aloqa ma'lumotlari, valyuta kurslari va uch tildagi "Biz haqimizda" matni
          </p>
        </div>

        {saved && (
          <div className="px-4 py-2 bg-[#E8F5E9] border border-[#A5D6A7] rounded text-xs text-[#1B5E20] flex items-center gap-1.5 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            <span>Muvaffaqiyatli saqlandi!</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Galereya Asosiy Ma'lumotlari */}
        <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 space-y-4 shadow-xs">
          <h3 className="font-serif text-lg font-semibold text-[#281C18] border-b pb-2 border-[#E7E0D8] flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#BA4E25]" />
            <span>Asosiy va Aloqa Ma'lumotlari</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                GALEREYA NOMI
              </label>
              <input
                type="text"
                required
                value={galleryName}
                onChange={(e) => setGalleryName(e.target.value)}
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                TELEFON RAQAMI
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                EMAIL MANZILI
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                ISH VAQTI
              </label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                MANZIL (MATN)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                XARITA HAVOLASI (GOOGLE MAPS / LOKATSIYA)
              </label>
              <input
                type="text"
                value={locationMap}
                onChange={(e) => setLocationMap(e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                TELEGRAM HAVOLASI
              </label>
              <input
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                INSTAGRAM HAVOLASI
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
              />
            </div>
          </div>
        </div>

        {/* 2. "Biz Haqimizda" Matnlari (3 tilda) */}
        <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 space-y-4 shadow-xs">
          <h3 className="font-serif text-lg font-semibold text-[#281C18] border-b pb-2 border-[#E7E0D8] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#429599]" />
            <span>"Biz Haqimizda" Matnlari (About Us)</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                O'ZBEKCHA (UZ - LOTIN)
              </label>
              <textarea
                rows={3}
                value={aboutUz}
                onChange={(e) => setAboutUz(e.target.value)}
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25] resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                INGLIZCHA (EN)
              </label>
              <textarea
                rows={3}
                value={aboutEn}
                onChange={(e) => setAboutEn(e.target.value)}
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25] resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                RUSCHA (RU)
              </label>
              <textarea
                rows={3}
                value={aboutRu}
                onChange={(e) => setAboutRu(e.target.value)}
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25] resize-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Valyuta Kurslari Boshqaruvi (cbu.uz vs Manual) */}
        <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b pb-2 border-[#E7E0D8]">
            <h3 className="font-serif text-lg font-semibold text-[#281C18]">
              Valyuta Kurslari Sozlamasi (Markaziy Bank / Qo'lda)
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#BA4E25]">
              <input
                type="checkbox"
                checked={manualRates}
                onChange={(e) => setManualRates(e.target.checked)}
                className="w-4 h-4 accent-[#BA4E25]"
              />
              <span>Kurslarni qo'lda belgilash</span>
            </label>
          </div>

          <p className="text-xs text-[#726861]">
            {manualRates
              ? 'Hozirda qo\'lda kiritilgan kurslar qo\'llanilmoqda. Quyidagi qiymatlarni kiritishingiz mumkin:'
              : 'Hozirda O\'zbekiston Respublikasi Markaziy Banki (cbu.uz) rasmiy kursi avtomatik yangilanmoqda.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                1 USD = UZS (SO'M)
              </label>
              <input
                type="number"
                disabled={!manualRates}
                value={rateUsd}
                onChange={(e) => setRateUsd(e.target.value)}
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25] disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                1 EUR = UZS (SO'M)
              </label>
              <input
                type="number"
                disabled={!manualRates}
                value={rateEur}
                onChange={(e) => setRateEur(e.target.value)}
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25] disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                1 RUB = UZS (SO'M)
              </label>
              <input
                type="number"
                disabled={!manualRates}
                value={rateRub}
                onChange={(e) => setRateRub(e.target.value)}
                className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25] disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#BA4E25] hover:bg-[#9C3E1B] text-white font-semibold text-xs px-6 py-3 rounded-[3px] transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saqlanmoqda...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Barcha Sozlamalarni Saqlash</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
