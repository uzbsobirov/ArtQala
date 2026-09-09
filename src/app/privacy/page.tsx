import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Art Qala Gallery',
  description: 'Privacy Policy of Art Qala Gallery in Tashkent, Uzbekistan. Learn how we handle your personal information, inquiries, and artwork transactions.',
};

export default function PrivacyPage() {

  return (
    <div className="py-16 sm:py-20 px-6">
      <div className="max-w-3xl mx-auto bg-[#FDFBF9] border border-[#E7E0D8] rounded-[4px] p-8 sm:p-12 space-y-6">
        <div className="space-y-2 border-b border-[#E7E0D8] pb-6">
          <span className="text-xs font-semibold tracking-[3px] text-[#429599] uppercase">
            LEGAL INFORMATION
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#281C18]">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#8F8178]">
            Effective Date: September 2026 · Art Qala Gallery, Tashkent
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#4D3F38] leading-relaxed">
          <h2 className="font-serif text-xl font-semibold text-[#281C18]">
            1. Information We Collect
          </h2>
          <p>
            When you inquire about original artwork, request bespoke mural or ceramics services, or register an account with Art Qala, we collect your name, email address, phone/Telegram details, country of residence, and project specifications.
          </p>

          <h2 className="font-serif text-xl font-semibold text-[#281C18]">
            2. How We Use Your Data
          </h2>
          <p>
            Your information is exclusively utilized to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process artwork purchase inquiries and coordinate secure courier crating.</li>
            <li>Send email one-time passwords (OTP) to verify your account security.</li>
            <li>Maintain your saved artwork wishlist and inquiry records in your private client dashboard.</li>
            <li>Issue official Certificates of Authenticity registered under your name.</li>
          </ul>

          <h2 className="font-serif text-xl font-semibold text-[#281C18]">
            3. Data Protection and Confidentiality
          </h2>
          <p>
            We strictly protect your personal details under the laws of the Republic of Uzbekistan. We do not sell, rent, or share personal data with external third parties for advertising purposes.
          </p>

          <h2 className="font-serif text-xl font-semibold text-[#281C18]">
            4. Contact Us
          </h2>
          <p>
            If you have questions regarding your data or wish to request deletion of your account, contact our data curator at: <strong className="text-[#BA4E25]">privacy@artqala.uz</strong> or visit our gallery at Barakhon Madrasah, Tashkent.
          </p>
        </div>
      </div>
    </div>
  );
}
