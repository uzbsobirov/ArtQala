'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

interface AnimatedGirihWatermarkProps {
  // Override the ink-line color when placed over a dark section (defaults to
  // the site's near-black ink for light/cream backgrounds).
  className?: string;
}

// Girih Sakkizburchak Yulduz (Ichan-Qala minora girihi) — hero orqa fon
// suvbelgisi (watermark). Scroll qilingani sari aylanadi va masshtablanadi.
export default function AnimatedGirihWatermark({ className = 'text-[#14201e]' }: AnimatedGirihWatermarkProps) {
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 800], [0, 45]);
  const scale = useTransform(scrollY, [0, 800], [1, 1.15]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
      <motion.div style={{ rotate, scale }} className={`w-[520px] h-[520px] opacity-[0.038] ${className}`}>
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          <rect x="45" y="45" width="110" height="110" stroke="currentColor" strokeWidth="1.5" />
          <rect x="45" y="45" width="110" height="110" stroke="#c59b27" strokeWidth="1.5" transform="rotate(45 100 100)" />
          <circle cx="100" cy="100" r="22" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="7" fill="#c59b27" />
        </svg>
      </motion.div>
    </div>
  );
}
