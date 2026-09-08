'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { UserPlus, Mail, Lock, User, Globe, AlertCircle, Check, X, ShieldCheck } from 'lucide-react';
import { COUNTRIES } from '@/lib/countries';

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [country, setCountry] = useState('Uzbekistan');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password real-time criteria (TZ Section 8.8)
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const isPasswordValid = hasMinLength && hasUppercase && hasNumber && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      if (!hasMinLength || !hasUppercase || !hasNumber) {
        setError('Parol talablarga to\'liq javob bermaydi (kamida 8 belgi, 1 ta katta harf va 1 ta raqam).');
        return;
      }
      if (!passwordsMatch) {
        setError('Kiritilgan parollar bir-biriga mos kelmadi.');
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, country, email, password }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
        setLoading(false);
        return;
      }

      // Route to OTP verification
      router.push(`/verify-otp?email=${encodeURIComponent(email)}&devOtp=${data.otpPreview || ''}`);
    } catch {
      setError('Serverga bog\'lanishda xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 px-6 flex items-center justify-center min-h-[85vh]">
      <div className="w-full max-w-md bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-8 sm:p-10 shadow-md">
        {/* Brand header */}
        <div className="text-center space-y-2 mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="Art Qala"
              width={140}
              height={46}
              className="h-10 w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="font-serif text-3xl font-semibold text-[#281C18]">
            Ro'yxatdan o'tish
          </h1>
          <p className="text-xs text-[#726861]">
            Art Qala galereyasiga a'zo bo'ling: sevimli kartinalaringizni saqlang, xizmatlarga buyurtma bering va rasmiy asillik sertifikatlarini oling
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-[#FFEBEE] border border-[#FFCDD2] rounded-[3px] text-xs text-[#C62828] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
              Ism va Familiya *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8F8178] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="masalan: Alisher Navoiy"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E7E0D8] rounded-[3px] text-sm text-[#281C18] focus:outline-none focus:border-[#BA4E25]"
              />
            </div>
          </div>

          {/* Full Country Select (TZ Section 8.7) */}
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
              Davlat (Country) *
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-[#8F8178] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-white border border-[#E7E0D8] rounded-[3px] text-sm text-[#281C18] focus:outline-none focus:border-[#BA4E25] appearance-none"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
              Email Manzil *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8F8178] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sizning.email@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E7E0D8] rounded-[3px] text-sm text-[#281C18] focus:outline-none focus:border-[#BA4E25]"
              />
            </div>
          </div>

          {/* Password (TZ Section 8.8) */}
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
              Parol *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8F8178] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E7E0D8] rounded-[3px] text-sm text-[#281C18] focus:outline-none focus:border-[#BA4E25]"
              />
            </div>
          </div>

          {/* Confirm Password (TZ Section 8.8) */}
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
              Parolni Tasdiqlash *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8F8178] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-[3px] text-sm text-[#281C18] focus:outline-none ${
                  confirmPassword.length > 0 && !passwordsMatch
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-[#E7E0D8] focus:border-[#BA4E25]'
                }`}
              />
            </div>
          </div>

          {/* Real-time Password Requirements Card */}
          <div className="bg-[#FAF4EC] border border-[#E7E0D8] rounded-[3px] p-3 space-y-1.5 text-[11px]">
            <div className="font-semibold text-[#6B5E55] mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#BA4E25]" />
              <span>Xavfsiz parol talablari:</span>
            </div>

            <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-green-700 font-medium' : 'text-[#8F7E73]'}`}>
              {hasMinLength ? <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-[#D2C5BA] shrink-0" />}
              <span>Kamida 8 ta belgi</span>
            </div>

            <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-green-700 font-medium' : 'text-[#8F7E73]'}`}>
              {hasUppercase ? <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-[#D2C5BA] shrink-0" />}
              <span>Kamida 1 ta katta harf (A-Z)</span>
            </div>

            <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-green-700 font-medium' : 'text-[#8F7E73]'}`}>
              {hasNumber ? <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-[#D2C5BA] shrink-0" />}
              <span>Kamida 1 ta raqam (0-9)</span>
            </div>

            {confirmPassword.length > 0 && (
              <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-green-700 font-medium' : 'text-red-600 font-medium'}`}>
                {passwordsMatch ? <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                <span>{passwordsMatch ? 'Parollar bir-biriga mos keldi' : 'Parollar mos kelmadi'}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || (password.length > 0 && !isPasswordValid)}
            className="w-full mt-2 py-3 px-4 bg-[#BA4E25] hover:bg-[#9C3E1B] text-white text-xs font-semibold uppercase tracking-wider rounded-[3px] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Yaratilmoqda...' : 'Hisob Yaratish (Sign Up)'}</span>
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#E7E0D8] text-center">
          <p className="text-xs text-[#726861]">
            Allaqachon hisobingiz bormi?{' '}
            <Link href="/signin" className="font-semibold text-[#BA4E25] hover:underline">
              Kirish (Sign In)
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
