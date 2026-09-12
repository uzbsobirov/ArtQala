'use client';

import { motion } from 'framer-motion';

// Islimiy Poyondoz (Xiva eshik-darvoza bordoni) — bo'limlararo ajratgich.
// Bo'limga kelganda o'rtadagi gul ochilib, chiziqlar ikki tomonga yoyiladi.
export default function AnimatedIslimiyDivider() {
  return (
    <div className="w-full flex items-center justify-center my-12 overflow-hidden opacity-50">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c59b27] to-[#14201e] origin-right"
      />
      <motion.svg
        initial={{ scale: 0, rotate: -45 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        width="46"
        height="32"
        viewBox="0 0 46 32"
        fill="none"
        className="mx-3 shrink-0"
      >
        <circle cx="23" cy="16" r="13" stroke="#14201e" strokeWidth="1.2" />
        <circle cx="23" cy="16" r="4.5" fill="#c59b27" />
        <path d="M12 16 C 17 8, 29 8, 34 16 C 29 24, 17 24, 12 16 Z" stroke="#14201e" strokeWidth="1" />
      </motion.svg>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#c59b27] to-[#14201e] origin-left"
      />
    </div>
  );
}
