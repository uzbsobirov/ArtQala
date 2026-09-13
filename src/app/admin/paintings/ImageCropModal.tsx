'use client';

import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { X, Check, ZoomIn, Loader2 } from 'lucide-react';

interface ImageCropModalProps {
  file: File;
  onCancel: () => void;
  onCropped: (croppedFile: File) => void;
  onSkip: (originalFile: File) => void;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.src = src;
  });
}

async function getCroppedBlob(imageSrc: string, cropPixels: Area): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Crop failed'))),
      'image/jpeg',
      0.92
    );
  });
}

export default function ImageCropModal({ file, onCancel, onCropped, onSkip }: ImageCropModalProps) {
  const [imageSrc] = useState(() => URL.createObjectURL(file));
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleConfirmCrop = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
      const croppedFile = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
        type: 'image/jpeg',
      });
      onCropped(croppedFile);
    } catch {
      alert('Kesishda xatolik yuz berdi');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full shadow-2xl border border-[#E7E0D8] overflow-hidden">
        <div className="flex items-center justify-between border-b px-5 py-3.5 border-[#E7E0D8]">
          <h3 className="font-serif text-lg font-bold text-[#281C18]">Rasmni kesish</h3>
          <button onClick={onCancel} className="text-[#8F8178] hover:text-[#281C18]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full h-[360px] bg-[#1D100B]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-[10.5px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1.5">
              Nisbat
            </label>
            <div className="flex gap-1.5">
              {[
                { label: 'Kvadrat', value: 1 },
                { label: 'Peyzaj 4:3', value: 4 / 3 },
                { label: 'Portret 3:4', value: 3 / 4 },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setAspect(opt.value)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all ${
                    aspect === opt.value
                      ? 'bg-[#281C18] text-[#FAF4EC] border-[#281C18]'
                      : 'bg-white text-[#554740] border-[#E7E0D8] hover:border-[#BA4E25]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[10.5px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1.5">
              <ZoomIn className="w-3.5 h-3.5" />
              Kattalashtirish
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-[#BA4E25]"
            />
          </div>

          <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-[#E7E0D8]">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-[#E7E0D8] text-xs font-semibold text-[#554740] rounded hover:bg-gray-50"
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={() => onSkip(file)}
              className="px-4 py-2 border border-[#E7E0D8] text-xs font-semibold text-[#554740] rounded hover:bg-gray-50"
            >
              Kesmasdan yuklash
            </button>
            <button
              type="button"
              onClick={handleConfirmCrop}
              disabled={processing || !croppedAreaPixels}
              className="px-4 py-2 bg-[#BA4E25] text-white text-xs font-semibold rounded hover:bg-[#9C3E1B] disabled:opacity-50 flex items-center gap-1.5"
            >
              {processing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>{processing ? 'Kesilmoqda...' : 'Kesish va yuklash'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
