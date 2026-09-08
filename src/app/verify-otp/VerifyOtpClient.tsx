'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function VerifyOtpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useApp();

  const emailParam = searchParams.get('email') || '';
  const devOtpParam = searchParams.get('devOtp') || '';

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState(devOtpParam);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
    if (devOtpParam) setCode(devOtpParam);
  }, [emailParam, devOtpParam]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Verification failed');
        return;
      }

      setSuccessMessage('Account verified successfully! Redirecting...');
      await refreshUser();
      setTimeout(() => {
        router.push('/account');
      }, 1200);
    } catch (err) {
      setError('An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 sm:py-20 px-6 flex items-center justify-center min-h-[75vh]">
      <div className="w-full max-w-md bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-8 sm:p-10 shadow-md text-center">
        <Link href="/" className="inline-block mb-6">
          <Image
            src="/logo.png"
            alt="Art Qala"
            width={140}
            height={46}
            className="h-10 w-auto mx-auto object-contain"
          />
        </Link>

        <div className="w-12 h-12 rounded-full bg-[#429599]/10 text-[#429599] flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h1 className="font-serif text-3xl font-semibold text-[#281C18]">
          Verify Your Email
        </h1>
        <p className="text-xs text-[#726861] mt-2 mb-6">
          We have sent a 6-digit confirmation code to{' '}
          <strong className="text-[#281C18]">{email || 'your email'}</strong>
        </p>

        {error && (
          <div className="mb-6 p-3.5 bg-[#FFEBEE] border border-[#FFCDD2] rounded-[3px] text-xs text-[#C62828] flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-3.5 bg-[#E8F5E9] border border-[#A5D6A7] rounded-[3px] text-xs text-[#1B5E20] flex items-center gap-2 text-left">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5 text-left">
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1.5 text-center">
              Enter 6-Digit Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full text-center text-2xl font-bold tracking-[6px] py-3 bg-white border border-[#E7E0D8] rounded-[3px] text-[#281C18] focus:outline-none focus:border-[#BA4E25]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full bg-[#BA4E25] hover:bg-[#9C3E1B] text-white font-semibold text-sm py-3 rounded-[3px] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-xs text-[#726861] mt-6">
          Didn't receive the code?{' '}
          <button
            type="button"
            onClick={() => alert('Code resent to ' + email)}
            className="text-[#BA4E25] font-semibold hover:underline"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
