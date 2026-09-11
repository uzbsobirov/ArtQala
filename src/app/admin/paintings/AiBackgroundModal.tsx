'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, X, Loader2, Check, RotateCcw, AlertCircle } from 'lucide-react';

interface AiBackgroundModalProps {
  originalImage: string;
  onClose: () => void;
  onAccept: (newImageUrl: string) => void;
}

export default function AiBackgroundModal({ originalImage, onClose, onAccept }: AiBackgroundModalProps) {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/admin/ai-generate-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: originalImage, prompt }),
      });
      const data = await res.json();
      if (data.success && data.imageDataUrl) {
        setResultUrl(data.imageDataUrl);
      } else {
        setError(data.error || 'Fon generatsiya qilishda xatolik yuz berdi');
      }
    } catch {
      setError('Serverga bog\'lanishda xatolik yuz berdi');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 border border-[#E7E0D8]">
        <div className="flex items-center justify-between border-b pb-3 border-[#E7E0D8]">
          <h3 className="font-serif text-lg font-bold text-[#281C18] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#BA4E25]" />
            AI Fon Generatsiya (Gemini)
          </h3>
          <button type="button" onClick={onClose} className="text-[#8F8178] hover:text-[#281C18]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1.5">
              Asl rasm
            </span>
            <div className="relative aspect-square rounded border border-[#E7E0D8] overflow-hidden bg-[#F4ECE1]">
              <Image src={originalImage} alt="Original" fill className="object-cover" />
            </div>
          </div>
          <div>
            <span className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1.5">
              AI natijasi
            </span>
            <div className="relative aspect-square rounded border border-[#E7E0D8] overflow-hidden bg-[#F4ECE1] flex items-center justify-center">
              {generating ? (
                <Loader2 className="w-8 h-8 text-[#BA4E25] animate-spin" />
              ) : resultUrl ? (
                <Image src={resultUrl} alt="AI generated" fill className="object-cover" />
              ) : (
                <span className="text-[11px] text-[#A8988E] px-4 text-center">
                  Natija shu yerda ko'rinadi
                </span>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
            Qo'shimcha uslub ko'rsatmasi (ixtiyoriy)
          </label>
          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Masalan: yorug' zamonaviy interyer, yog'och pol, tabiiy yorug'lik..."
            disabled={generating}
            className="w-full text-xs px-3 py-2 border border-[#E7E0D8] rounded focus:outline-none focus:border-[#BA4E25] resize-none disabled:opacity-60"
          />
          <p className="text-[10.5px] text-[#8F8178] mt-1">
            Rasmning o'zi (kartina) o'zgarmaydi — faqat orqa fon/muhit generatsiya qilinadi.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] text-xs rounded flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-[#E7E0D8]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#E7E0D8] text-xs font-semibold text-[#554740] rounded hover:bg-gray-50"
          >
            Bekor qilish (asl rasm qoladi)
          </button>

          {resultUrl && (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="px-4 py-2 border border-[#E7E0D8] text-xs font-semibold text-[#554740] rounded hover:bg-gray-50 flex items-center gap-1.5 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Qayta generatsiya qilish
            </button>
          )}

          {!resultUrl && (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="px-4 py-2 bg-[#BA4E25] text-white text-xs font-semibold rounded hover:bg-[#9C3E1B] disabled:opacity-50 flex items-center gap-1.5"
            >
              {generating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generatsiya qilinmoqda...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generatsiya qilish
                </>
              )}
            </button>
          )}

          {resultUrl && (
            <button
              type="button"
              onClick={() => onAccept(resultUrl)}
              className="px-4 py-2 bg-[#BA4E25] text-white text-xs font-semibold rounded hover:bg-[#9C3E1B] flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Ushbu natijani ishlatish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
