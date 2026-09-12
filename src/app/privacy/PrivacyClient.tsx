'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

const CONTENT = {
  en: {
    eyebrow: 'LEGAL INFORMATION',
    title: 'Privacy Policy',
    effectiveDate: 'Effective Date: September 2026 · Art Qala Gallery, Tashkent',
    sections: [
      {
        heading: '1. Information We Collect',
        body: 'When you inquire about original artwork, request bespoke mural or ceramics services, or register an account with Art Qala, we collect your name, email address, phone/Telegram details, country of residence, and project specifications.',
      },
      {
        heading: '2. How We Use Your Data',
        body: 'Your information is exclusively utilized to:',
        list: [
          'Process artwork purchase inquiries and coordinate secure courier crating.',
          'Send email one-time passwords (OTP) to verify your account security.',
          'Maintain your saved artwork wishlist and inquiry records in your private client dashboard.',
          'Issue official Certificates of Authenticity registered under your name.',
        ],
      },
      {
        heading: '3. Data Protection and Confidentiality',
        body: 'We strictly protect your personal details under the laws of the Republic of Uzbekistan. We do not sell, rent, or share personal data with external third parties for advertising purposes.',
      },
      {
        heading: '4. Contact Us',
        bodyPrefix: 'If you have questions regarding your data or wish to request deletion of your account, contact our data curator at: ',
        highlight: 'privacy@artqala.uz',
        bodySuffix: ' or visit our gallery at Barakhon Madrasah, Tashkent.',
      },
    ],
  },
  ru: {
    eyebrow: 'ПРАВОВАЯ ИНФОРМАЦИЯ',
    title: 'Политика конфиденциальности',
    effectiveDate: 'Дата вступления в силу: сентябрь 2026 г. · Галерея Art Qala, Ташкент',
    sections: [
      {
        heading: '1. Какую информацию мы собираем',
        body: 'Когда вы отправляете запрос об оригинальной картине, заказываете мурал или керамику, либо регистрируете аккаунт в Art Qala, мы собираем ваше имя, email, номер телефона/Telegram, страну проживания и детали проекта.',
      },
      {
        heading: '2. Как мы используем ваши данные',
        body: 'Ваша информация используется исключительно для того, чтобы:',
        list: [
          'Обрабатывать запросы на покупку картин и организовывать безопасную упаковку и курьерскую доставку.',
          'Отправлять одноразовые коды подтверждения (OTP) по email для защиты вашего аккаунта.',
          'Вести список избранных работ и историю запросов в вашем личном кабинете.',
          'Оформлять официальные Сертификаты подлинности на ваше имя.',
        ],
      },
      {
        heading: '3. Защита данных и конфиденциальность',
        body: 'Мы строго защищаем ваши персональные данные в соответствии с законодательством Республики Узбекистан. Мы не продаём, не сдаём в аренду и не передаём персональные данные третьим лицам в рекламных целях.',
      },
      {
        heading: '4. Свяжитесь с нами',
        bodyPrefix: 'Если у вас есть вопросы о ваших данных или вы хотите удалить свой аккаунт, обратитесь к нашему куратору данных: ',
        highlight: 'privacy@artqala.uz',
        bodySuffix: ' или посетите нашу галерею в медресе Баракхан, Ташкент.',
      },
    ],
  },
  uz: {
    eyebrow: "HUQUQIY MA'LUMOT",
    title: 'Maxfiylik siyosati',
    effectiveDate: "Kuchga kirgan sana: 2026-yil sentyabr · Art Qala galereyasi, Toshkent",
    sections: [
      {
        heading: "1. Biz qanday ma'lumotlarni to'playmiz",
        body: "Siz asl kartina bo'yicha so'rov yuborganingizda, mural yoki keramika xizmatiga buyurtma berganingizda yoki Art Qala'da hisob ochganingizda, biz sizning ismingiz, email manzilingiz, telefon/Telegram ma'lumotlaringiz, yashash mamlakatingiz va loyiha tafsilotlarini to'playmiz.",
      },
      {
        heading: "2. Ma'lumotlaringizdan qanday foydalanamiz",
        body: "Sizning ma'lumotlaringiz faqat quyidagilar uchun ishlatiladi:",
        list: [
          "Kartina sotib olish so'rovlarini ko'rib chiqish va xavfsiz qadoqlash/kuryerlik yetkazib berishni tashkil qilish.",
          "Hisobingiz xavfsizligini tasdiqlash uchun email orqali bir martalik kod (OTP) yuborish.",
          "Shaxsiy kabinetingizda saqlangan asarlar ro'yxati va so'rovlar tarixini yuritish.",
          "Sizning nomingizga rasmiy Asillik sertifikatlarini rasmiylashtirish.",
        ],
      },
      {
        heading: "3. Ma'lumotlarni himoya qilish va maxfiylik",
        body: "Biz sizning shaxsiy ma'lumotlaringizni O'zbekiston Respublikasi qonunchiligiga muvofiq qat'iy himoya qilamiz. Shaxsiy ma'lumotlarni reklama maqsadida uchinchi shaxslarga sotmaymiz, ijaraga bermaymiz yoki ulashmaymiz.",
      },
      {
        heading: "4. Biz bilan bog'lanish",
        bodyPrefix: "Ma'lumotlaringiz yuzasidan savollaringiz bo'lsa yoki hisobingizni o'chirishni so'ramoqchi bo'lsangiz, ma'lumotlar kuratorimizga murojaat qiling: ",
        highlight: 'privacy@artqala.uz',
        bodySuffix: " yoki Toshkentdagi Baraxon madrasasidagi galereyamizga tashrif buyuring.",
      },
    ],
  },
} as const;

export default function PrivacyClient() {
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
              {'bodyPrefix' in section ? (
                <p>
                  {section.bodyPrefix}
                  <strong className="text-[#BA4E25]">{section.highlight}</strong>
                  {section.bodySuffix}
                </p>
              ) : (
                <p>{section.body}</p>
              )}
              {'list' in section && (
                <ul className="list-disc pl-5 space-y-1">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
