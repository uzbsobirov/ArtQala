'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

const CONTENT = {
  en: {
    eyebrow: 'TERMS & CONDITIONS',
    title: 'Terms of Service',
    effectiveDate: 'Effective Date: September 2026 · Art Qala Gallery, Tashkent',
    sections: [
      {
        heading: '1. Original Artworks & Authenticity',
        body: "All paintings featured on Art Qala are original, one-of-a-kind canvases handcrafted by registered masters in Uzbekistan. Each purchased original artwork is accompanied by an official Certificate of Authenticity bearing the artist's signature and the gallery's embossed seal.",
      },
      {
        heading: '2. Inquiries and Reservation',
        body: 'Submission of an inquiry on this platform does not constitute a binding financial charge. Our curators will review availability, calculate international insured freight or arrange personal collection at our Tashkent location, and provide a formal invoice.',
      },
      {
        heading: '3. Bespoke Services & Murals',
        body: 'Quotes for custom paintings and wall murals include surface preparation, concept sketches, and on-site painting. Project schedules and milestone payments are confirmed individually per contract.',
      },
      {
        heading: '4. Cultural Heritage Regulations',
        body: 'All contemporary artworks exported internationally comply fully with Ministry of Culture regulations of the Republic of Uzbekistan. We provide all necessary export clearance documentation for seamless customs transit.',
      },
    ],
  },
  ru: {
    eyebrow: 'УСЛОВИЯ ИСПОЛЬЗОВАНИЯ',
    title: 'Условия обслуживания',
    effectiveDate: 'Дата вступления в силу: сентябрь 2026 г. · Галерея Art Qala, Ташкент',
    sections: [
      {
        heading: '1. Оригинальные работы и подлинность',
        body: 'Все картины, представленные в Art Qala, — оригинальные, уникальные полотна, созданные вручную зарегистрированными мастерами Узбекистана. К каждой приобретённой оригинальной работе прилагается официальный Сертификат подлинности с подписью художника и тиснёной печатью галереи.',
      },
      {
        heading: '2. Запросы и бронирование',
        body: 'Отправка запроса на платформе не влечёт обязательного финансового списания. Наши кураторы проверят наличие, рассчитают стоимость международной застрахованной доставки или организуют личное получение в Ташкенте, а также предоставят официальный счёт.',
      },
      {
        heading: '3. Индивидуальные заказы и мурали',
        body: 'Расчёт стоимости индивидуальных картин и настенных муралов включает подготовку поверхности, эскизы концепции и работу на месте. График проекта и поэтапная оплата согласовываются индивидуально по договору.',
      },
      {
        heading: '4. Регулирование культурного наследия',
        body: 'Все современные произведения искусства, вывозимые за рубеж, полностью соответствуют требованиям Министерства культуры Республики Узбекистан. Мы предоставляем всю необходимую документацию для беспрепятственного таможенного оформления.',
      },
    ],
  },
  uz: {
    eyebrow: 'FOYDALANISH SHARTLARI',
    title: 'Xizmat ko\'rsatish shartlari',
    effectiveDate: "Kuchga kirgan sana: 2026-yil sentyabr · Art Qala galereyasi, Toshkent",
    sections: [
      {
        heading: '1. Asl asarlar va asillik',
        body: "Art Qala'da taqdim etilgan barcha kartinalar — O'zbekistonda ro'yxatdan o'tgan ustalar tomonidan qo'lda yaratilgan asl, yagona nusxadagi asarlardir. Sotib olingan har bir asl asarga rassomning imzosi va galereyaning muhri tushirilgan rasmiy Asillik sertifikati biriktiriladi.",
      },
      {
        heading: '2. So\'rovlar va band qilish',
        body: "Ushbu platformada so'rov yuborish majburiy moliyaviy to'lovni anglatmaydi. Kuratorlarimiz mavjudlikni tekshiradi, xalqaro sug'urtalangan yetkazib berish narxini hisoblaydi yoki Toshkentdagi galereyamizdan shaxsan olib ketishni tashkil qiladi hamda rasmiy hisob-faktura taqdim etadi.",
      },
      {
        heading: '3. Maxsus buyurtmalar va murallar',
        body: "Buyurtma asosidagi kartinalar va devoriy rasmlar (mural) narxiga sirtni tayyorlash, konsept eskizlar va joyida ishlash kiradi. Loyiha jadvali va bosqichma-bosqich to'lovlar har bir shartnoma bo'yicha alohida kelishiladi.",
      },
      {
        heading: "4. Madaniy meros to'g'risidagi qoidalar",
        body: "Xalqaro jo'natiladigan barcha zamonaviy san'at asarlari O'zbekiston Respublikasi Madaniyat vazirligi qoidalariga to'liq muvofiq keladi. Bojxona orqali muammosiz o'tishi uchun barcha zarur eksport hujjatlarini biz taqdim etamiz.",
      },
    ],
  },
} as const;

export default function TermsClient() {
  const { lang } = useApp();
  const c = CONTENT[lang] || CONTENT.en;

  return (
    <div className="py-16 sm:py-20 px-6">
      <div className="max-w-3xl mx-auto bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-8 sm:p-12 space-y-6">
        <div className="space-y-2 border-b border-[#E7E0D8] pb-6">
          <span className="text-xs font-semibold tracking-[3px] text-[#429599] uppercase">
            {c.eyebrow}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#281C18]">
            {c.title}
          </h1>
          <p className="text-xs text-[#8F8178]">{c.effectiveDate}</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#4D3F38] leading-relaxed">
          {c.sections.map((section, idx) => (
            <React.Fragment key={idx}>
              <h2 className="font-serif text-xl font-semibold text-[#281C18]">
                {section.heading}
              </h2>
              <p>{section.body}</p>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
