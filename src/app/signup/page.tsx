'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { UserPlus, Mail, Lock, User, Globe, AlertCircle } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [country, setCountry] = useState('Uzbekistan');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, country, email, password }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Failed to create account');
        return;
      }

      // If OTP was returned in dev mode, show it or pass via query
      router.push(`/verify-otp?email=${encodeURIComponent(email)}&devOtp=${data.otpPreview || ''}`);
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 sm:py-20 px-6 flex items-center justify-center min-h-[80vh]">
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
            Create Account
          </h1>
          <p className="text-xs text-[#726861]">
            Join Art Qala to save your favorite paintings, request commissions, and receive official authenticity certificates
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
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8F8178] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. David Sterling"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E7E0D8] rounded-[3px] text-sm text-[#281C18] focus:outline-none focus:border-[#BA4E25]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
              Country *
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-[#8F8178] absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E7E0D8] rounded-[3px] text-sm text-[#281C18] focus:outline-none focus:border-[#BA4E25]"
              >
                <option value="Uzbekistan">Uzbekistan</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Italy">Italy</option>
                <option value="Russia">Russia</option>
                <option value="Kazakhstan">Kazakhstan</option>
                <option value="Turkey">Turkey</option>
                <option value="Japan">Japan</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8F8178] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="david@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E7E0D8] rounded-[3px] text-sm text-[#281C18] focus:outline-none focus:border-[#BA4E25]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8F8178] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E7E0D8] rounded-[3px] text-sm text-[#281C18] focus:outline-none focus:border-[#BA4E25]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#BA4E25] hover:bg-[#9C3E1B] text-white font-semibold text-sm py-3 rounded-[3px] transition-all flex items-center justify-center gap-2 shadow-sm mt-4"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Continue to Verification'}</span>
          </button>
        </form>

        <p className="text-center text-xs text-[#726861] mt-8">
          Already have an account?{' '}
          <Link
            href="/signin"
            className="font-bold text-[#BA4E25] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
