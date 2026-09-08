'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [usdToUzs, setUsdToUzs] = useState('12750');
  const [usdToRub, setUsdToRub] = useState('92.5');
  const [usdToEur, setUsdToEur] = useState('0.92');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-semibold text-[#281C18]">
          Gallery &amp; Currency Settings
        </h2>
        <p className="text-xs text-[#726861] mt-0.5">
          Exchange rates and operational configurations
        </p>
      </div>

      {saved && (
        <div className="p-3.5 bg-[#E8F5E9] border border-[#A5D6A7] rounded-[3px] text-xs text-[#1B5E20] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
          <span>Exchange rates saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-6 space-y-5 shadow-xs">
        <h3 className="font-serif text-xl font-semibold text-[#281C18]">
          Manual Currency Rates (Base: 1 USD)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
              1 USD = UZS (SO'M)
            </label>
            <input
              type="number"
              value={usdToUzs}
              onChange={(e) => setUsdToUzs(e.target.value)}
              className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
              1 USD = RUB (₽)
            </label>
            <input
              type="text"
              value={usdToRub}
              onChange={(e) => setUsdToRub(e.target.value)}
              className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
              1 USD = EUR (€)
            </label>
            <input
              type="text"
              value={usdToEur}
              onChange={(e) => setUsdToEur(e.target.value)}
              className="w-full text-xs px-3.5 py-2 bg-white border border-[#E7E0D8] rounded-[3px] focus:outline-none focus:border-[#BA4E25]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#F0EAE1]">
          <h4 className="font-serif text-lg font-semibold text-[#281C18] mb-3">
            Gallery Physical Address
          </h4>
          <p className="text-xs text-[#554740] bg-[#FAF4EC] p-3 rounded-[3px] border border-[#E7E0D8]">
            4 Registon Street, Samarkand 140100, Uzbekistan · Open daily 10:00 – 19:00
          </p>
        </div>

        <button
          type="submit"
          className="bg-[#BA4E25] hover:bg-[#9C3E1B] text-white font-semibold text-xs px-5 py-2.5 rounded-[3px] transition-all flex items-center gap-1.5 shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </form>
    </div>
  );
}
