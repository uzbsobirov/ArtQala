'use client';

import React, { useMemo, useState } from 'react';
import { getCountries, type CountryCode } from 'libphonenumber-js';
import { useApp } from '@/context/AppContext';
import { estimateShipping, estimatePaintingWeightKg, POSILKA_RATES_UZS, EMS_ZONE_BY_COUNTRY } from '@/lib/shipping';
import { Truck, Info } from 'lucide-react';

interface ShippingEstimatorProps {
  sizeString: string;
}

function parseSizeToCm(sizeString: string): { widthCm: number; heightCm: number } | null {
  const match = sizeString.match(/(\d+(?:\.\d+)?)\s*[×x*X]\s*(\d+(?:\.\d+)?)(?:\s*(sm|cm|in|dyum))?/i);
  if (!match) return null;
  const w = parseFloat(match[1]);
  const h = parseFloat(match[2]);
  const unit = (match[3] || 'sm').toLowerCase();
  const isInches = unit === 'in' || unit === 'dyum';
  return {
    widthCm: isInches ? w * 2.54 : w,
    heightCm: isInches ? h * 2.54 : h,
  };
}

function guessDefaultCountry(): CountryCode {
  const countries = getCountries();
  try {
    const region = (navigator.language || '').split('-')[1]?.toUpperCase();
    if (region && countries.includes(region as CountryCode)) return region as CountryCode;
  } catch {}
  return countries.includes('US' as CountryCode) ? ('US' as CountryCode) : countries[0];
}

const countryDisplayNames = (() => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' });
  } catch {
    return null;
  }
})();

export default function ShippingEstimator({ sizeString }: ShippingEstimatorProps) {
  const { t, settings } = useApp();
  const countries = useMemo(
    () => getCountries().filter((c) => POSILKA_RATES_UZS[c] || EMS_ZONE_BY_COUNTRY[c]).sort(),
    []
  );
  const [country, setCountry] = useState<CountryCode>(guessDefaultCountry());

  const parsedSize = parseSizeToCm(sizeString);
  const somPerUsd = settings?.rate_usd;

  if (!parsedSize || !somPerUsd) return null;

  const weightKg = estimatePaintingWeightKg(parsedSize.widthCm, parsedSize.heightCm);
  const estimate = estimateShipping(country, weightKg, somPerUsd);

  return (
    <div className="bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Truck className="w-4 h-4 text-[#BA4E25]" />
        <h4 className="text-xs font-bold tracking-wider text-[#6B5E55] uppercase">
          {t.shippingEstimator.title}
        </h4>
      </div>

      <div>
        <label className="block text-[10.5px] font-bold tracking-wider text-[#6B5E55] uppercase mb-1">
          {t.shippingEstimator.selectCountry}
        </label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value as CountryCode)}
          className="w-full text-xs px-3 py-2 bg-white border border-[#E7E0D8] rounded-[2px] focus:outline-none focus:border-[#BA4E25]"
        >
          {countries.map((c) => (
            <option key={c} value={c}>
              {countryDisplayNames ? countryDisplayNames.of(c) : c}
            </option>
          ))}
        </select>
      </div>

      {estimate.posilka || estimate.ems ? (
        <div className="space-y-2">
          {estimate.posilka && (
            <div className="flex items-center justify-between text-xs bg-white border border-[#E7E0D8] rounded-[2px] px-3 py-2">
              <span className="font-semibold text-[#281C18]">{t.shippingEstimator.posilkaLabel}</span>
              <span className="text-[#554740]">
                ${estimate.posilka.priceUsd} · {estimate.posilka.estimatedDays} {t.shippingEstimator.daysUnit}
              </span>
            </div>
          )}
          {estimate.ems && (
            <div className="flex items-center justify-between text-xs bg-white border border-[#E7E0D8] rounded-[2px] px-3 py-2">
              <span className="font-semibold text-[#281C18]">{t.shippingEstimator.emsLabel}</span>
              <span className="text-[#554740]">
                ${estimate.ems.priceUsd} · {estimate.ems.estimatedDays} {t.shippingEstimator.daysUnit}
              </span>
            </div>
          )}
          <p className="text-[10.5px] text-[#8F8178] flex items-start gap-1 pt-1">
            <Info className="w-3 h-3 shrink-0 mt-0.5" />
            <span>{t.shippingEstimator.refundNote}</span>
          </p>
          <p className="text-[10px] text-[#A8988E]">{t.shippingEstimator.disclaimer}</p>
        </div>
      ) : (
        <p className="text-xs text-[#8F8178]">{t.shippingEstimator.notAvailable}</p>
      )}
    </div>
  );
}
