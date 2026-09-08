'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { MapPin, Phone, MessageSquare, Clock, CheckCircle2, Send } from 'lucide-react';

export default function ContactClient() {
  const { t } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setError(data.error || 'Xabar yuborishda xatolik yuz berdi.');
      }
    } catch {
      setError('Serverga ulanishda xatolik. Iltimos qaytadan urinib ko\'ring.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-14 sm:py-16">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Page Head */}
        <div className="max-w-2xl mb-12 space-y-2">
          <span className="text-xs font-semibold tracking-[3px] text-[#429599] uppercase">
            {t.contact.eyebrow}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#281C18]">
            {t.contact.title}
          </h1>
          <p className="text-sm sm:text-base text-[#6E6057] leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-[#FDFBF9] border border-[#E7E0D8] rounded-[3px] p-7 sm:p-9 shadow-xs">
            {submitted ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#2E7D32] mx-auto" />
                <h3 className="font-serif text-2xl font-semibold text-[#281C18]">
                  Message Received
                </h3>
                <p className="text-sm text-[#6E6057] max-w-md mx-auto">
                  {t.contact.messageSuccess}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold text-[#BA4E25] hover:underline"
                >
                  Send another message →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    {t.contact.formName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Michael Davies"
                    className="w-full text-sm px-3.5 py-2.5 bg-white border border-[#E7E0D8] rounded-[2px] focus:outline-none focus:border-[#BA4E25] text-[#281C18]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    {t.contact.formEmail} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="michael@example.com"
                    className="w-full text-sm px-3.5 py-2.5 bg-white border border-[#E7E0D8] rounded-[2px] focus:outline-none focus:border-[#BA4E25] text-[#281C18]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    {t.contact.formSubject} *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Question about painting / Visit / Custom order"
                    className="w-full text-sm px-3.5 py-2.5 bg-white border border-[#E7E0D8] rounded-[2px] focus:outline-none focus:border-[#BA4E25] text-[#281C18]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
                    {t.contact.formMessage} *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you with our collection or visiting the gallery?"
                    className="w-full text-sm px-3.5 py-2.5 bg-white border border-[#E7E0D8] rounded-[2px] focus:outline-none focus:border-[#BA4E25] text-[#281C18] resize-none"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#BA4E25] hover:bg-[#9C3E1B] text-white font-semibold text-sm py-3 rounded-[3px] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <span>Yuborilmoqda...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.contact.formBtn}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Visit, Reach Directly, Map Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Visit Card */}
            <div className="bg-[#281C18] text-[#FAF4EC] rounded-[3px] p-6 space-y-3">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-[2px] text-[#5AB3B7] uppercase">
                <MapPin className="w-4 h-4" />
                <span>{t.contact.visitTitle}</span>
              </div>
              <p className="text-sm font-medium">{t.contact.address}</p>
              <div className="flex items-center gap-2 text-xs text-[#C8B9AF]">
                <Clock className="w-3.5 h-3.5 text-[#5AB3B7]" />
                <span>{t.contact.hours}</span>
              </div>
            </div>

            {/* Direct Contact Card */}
            <div className="bg-[#281C18] text-[#FAF4EC] rounded-[3px] p-6 space-y-3">
              <div className="text-[11px] font-bold tracking-[2px] text-[#5AB3B7] uppercase">
                {t.contact.directTitle}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#BA4E25]" />
                  <a href="tel:+998901234567" className="hover:text-[#5AB3B7] transition-colors">
                    {t.contact.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-[#BA4E25]" />
                  <a
                    href="https://t.me/artqala"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#5AB3B7] transition-colors"
                  >
                    {t.contact.telegram}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#BA4E25]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  <a
                    href="https://instagram.com/artqala.gallery"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#5AB3B7] transition-colors"
                  >
                    {t.contact.instagram}
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive Map Pin Illustration */}
            <div className="relative aspect-[16/10] w-full rounded-[3px] overflow-hidden border border-[#E7E0D8] bg-[#F4ECE1]">
              <Image
                src="/assets/p-courtyard.svg"
                alt="Samarkand Gallery location preview"
                fill
                className="object-cover brightness-95"
              />
              <div className="absolute inset-0 bg-[#1D100B]/20 pointer-events-none" />

              {/* Pulsing Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-[#BA4E25] opacity-75"></span>
                  <div className="relative bg-[#BA4E25] text-white p-2.5 rounded-full shadow-lg">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2 bg-[#FAF4EC]/95 backdrop-blur-xs text-[#281C18] text-[10.5px] font-bold px-2.5 py-1 rounded-sm shadow-sm border border-[#E7E0D8]">
                  Art Qala · Registon 4
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
