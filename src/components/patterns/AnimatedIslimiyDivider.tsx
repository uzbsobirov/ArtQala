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
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className="mx-3 shrink-0"
      >
        <circle cx="6" cy="6" r="4.5" fill="#c59b27" />
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
