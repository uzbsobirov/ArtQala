'use client';

import React, { useState } from 'react';
import { ShieldAlert, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ChangePasswordModal() {
  const { refreshUser, signOut } = useApp();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Parollar bir-biriga mos kelmadi");
      return;
    }

    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError("Yangi parol kamida 8 ta belgi, 1 ta katta harf va 1 ta raqamdan iborat bo'lishi shart");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(async () => {
          await refreshUser();
        }, 1500);
      } else {
        setError(data.error || "Parolni o'zgartirib bo'lmadi");
      }
    } catch {
      setError('Server bilan aloqa xatosi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#1D100B]/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF4EC] border border-[#E7E0D8] rounded-[4px] max-w-md w-full p-7 space-y-5 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 border border-[#FDE68A]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold text-[#281C18]">
              Xavfsizlik: Parolni Yangilash
            </h3>
            <p className="text-xs text-[#726861] mt-0.5">
              Standart parol o'rniga o'zingizning shaxsiy xavfsiz parolingizni o'rnating.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] text-xs rounded-[2px] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-4 bg-[#DCFCE7] border border-[#86EFAC] text-[#16A34A] text-xs rounded-[3px] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-semibold">Parol muvaffaqiyatli yangilandi! Admin panelga yo'naltirilmoqda...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                Yangi Parol *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Kamida 8 belgi, 1 katta harf, 1 raqam"
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#E7E0D8] rounded-[2px] focus:outline-none focus:border-[#BA4E25] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#8F8178] hover:text-[#281C18]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                Parolni Tasdiqlang *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Parolni qayta kiriting"
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#E7E0D8] rounded-[2px] focus:outline-none focus:border-[#BA4E25]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => signOut()}
                className="text-xs text-[#8F8178] hover:text-[#BA4E25] underline"
              >
                Chiqish (Sign out)
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#BA4E25] hover:bg-[#9C3E1B] text-white font-semibold text-xs px-6 py-2.5 rounded-[3px] transition flex items-center gap-2 shadow-xs disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{loading ? 'Yangilanmoqda...' : 'Parolni Saqlash'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
