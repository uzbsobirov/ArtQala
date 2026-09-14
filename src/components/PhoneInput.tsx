'use client';

import React, { useMemo, useState } from 'react';
import { getCountries, getCountryCallingCode, isValidPhoneNumber, type CountryCode } from 'libphonenumber-js';
import { useApp } from '@/context/AppContext';
import FilterSelect from '@/components/FilterSelect';

const TELEGRAM_REGEX = /^@[a-zA-Z0-9_]{5,32}$/;

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidityChange?: (isValid: boolean) => void;
  required?: boolean;
}

function guessDefaultCountry(): CountryCode {
  const countries = getCountries();
  try {
    const region = (navigator.language || '').split('-')[1]?.toUpperCase();
    if (region && countries.includes(region as CountryCode)) return region as CountryCode;
  } catch {}
  return countries.includes('UZ' as CountryCode) ? ('UZ' as CountryCode) : countries[0];
}

export default function PhoneInput({ value, onChange, onValidityChange, required = true }: PhoneInputProps) {
  const { t } = useApp();
  const countries = useMemo(() => getCountries().sort(), []);
  const [mode, setMode] = useState<'phone' | 'telegram'>(value.trim().startsWith('@') ? 'telegram' : 'phone');
  const [country, setCountry] = useState<CountryCode>(guessDefaultCountry());
  const [localNumber, setLocalNumber] = useState(() =>
    value && !value.startsWith('@') ? value.replace(/^\+\d+\s*/, '') : ''
  );
  const [telegramHandle, setTelegramHandle] = useState(value.trim().startsWith('@') ? value.trim() : '');
  const [touched, setTouched] = useState(false);

  const fullPhoneValue = `+${getCountryCallingCode(country)}${localNumber.replace(/[^0-9]/g, '')}`;

  const isValid =
    mode === 'telegram'
      ? TELEGRAM_REGEX.test(telegramHandle.trim())
      : localNumber.trim().length > 0 && isValidPhoneNumber(fullPhoneValue, country);

  const emitChange = (nextMode: 'phone' | 'telegram', nextCountry: CountryCode, nextLocal: string, nextHandle: string) => {
    const raw = nextMode === 'telegram' ? nextHandle.trim() : `+${getCountryCallingCode(nextCountry)}${nextLocal.replace(/[^0-9]/g, '')}`;
    onChange(nextLocal.trim() === '' && nextHandle.trim() === '' ? '' : raw);
  };

  React.useEffect(() => {
    onValidityChange?.(!required || isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid, required]);

  const errorMessage =
    touched && !isValid
      ? mode === 'telegram'
        ? t.phoneInput.invalidTelegram
        : t.phoneInput.invalidPhone
      : '';

  return (
    <div>
      <div className="flex items-center gap-1 mb-1.5">
        <button
          type="button"
          onClick={() => {
            setMode('phone');
            emitChange('phone', country, localNumber, telegramHandle);
          }}
          className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
            mode === 'phone'
              ? 'bg-[#281C18] text-[#FAF4EC] border-[#281C18]'
              : 'bg-white text-[#554740] border-[#E7E0D8]'
          }`}
        >
          {t.phoneInput.phoneMode}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('telegram');
            emitChange('telegram', country, localNumber, telegramHandle);
          }}
          className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
            mode === 'telegram'
              ? 'bg-[#281C18] text-[#FAF4EC] border-[#281C18]'
              : 'bg-white text-[#554740] border-[#E7E0D8]'
          }`}
        >
          {t.phoneInput.telegramMode}
        </button>
      </div>

      {mode === 'phone' ? (
        <div className="flex items-center gap-1.5 bg-white border border-[#E7E0D8] rounded-[2px] focus-within:border-[#BA4E25]">
          <FilterSelect
            value={country}
            onChange={(v) => {
              const nextCountry = v as CountryCode;
              setCountry(nextCountry);
              emitChange('phone', nextCountry, localNumber, telegramHandle);
            }}
            searchable
            searchPlaceholder={t.phoneInput.phoneMode}
            className="w-[92px] shrink-0"
            buttonClassName="!rounded-l-[2px] !rounded-r-none !border-0 !border-r !border-[#E7E0D8] !bg-[#FAF4EC] !py-2 !px-2 !text-xs !ring-0 focus:!ring-0"
            options={countries.map((c) => ({ value: c, label: `${c} +${getCountryCallingCode(c)}` }))}
          />
          <input
            type="tel"
            required={required}
            value={localNumber}
            onChange={(e) => {
              setLocalNumber(e.target.value);
              emitChange('phone', country, e.target.value, telegramHandle);
            }}
            onBlur={() => setTouched(true)}
            placeholder={t.phoneInput.phonePlaceholder}
            className="w-full text-xs px-2.5 py-2 focus:outline-none"
          />
        </div>
      ) : (
        <div className="flex items-center bg-white border border-[#E7E0D8] rounded-[2px] overflow-hidden focus-within:border-[#BA4E25]">
          <span className="text-xs text-[#8F7E73] pl-3">@</span>
          <input
            type="text"
            required={required}
            value={telegramHandle.replace(/^@/, '')}
            onChange={(e) => {
              const next = `@${e.target.value.replace(/^@/, '')}`;
              setTelegramHandle(next);
              emitChange('telegram', country, localNumber, next);
            }}
            onBlur={() => setTouched(true)}
            placeholder={t.phoneInput.telegramPlaceholder}
            className="w-full text-xs pl-0.5 pr-2.5 py-2 focus:outline-none"
          />
        </div>
      )}

      {errorMessage && <p className="text-[10.5px] text-[#B91C1C] mt-1">{errorMessage}</p>}
    </div>
  );
}
