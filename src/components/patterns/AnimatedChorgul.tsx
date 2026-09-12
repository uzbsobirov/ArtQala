'use client';

import { motion } from 'framer-motion';

// Xorazm Chorgul (to'rt yaproq) — valyuta/til tanlagich yonidagi interaktiv
// belgi. Hover/tap qilinganda 90 daraja aylanib elastik reaksiya beradi.
export default function AnimatedChorgul() {
  return (
    <motion.div
      whileHover={{ rotate: 90, scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="inline-flex items-center justify-center cursor-pointer p-1"
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="2.5" fill="#c59b27" />
        <circle cx="11" cy="5" r="3.2" stroke="#14201e" strokeWidth="1" fill="none" />
        <circle cx="11" cy="17" r="3.2" stroke="#14201e" strokeWidth="1" fill="none" />
        <circle cx="5" cy="11" r="3.2" stroke="#14201e" strokeWidth="1" fill="none" />
        <circle cx="17" cy="11" r="3.2" stroke="#14201e" strokeWidth="1" fill="none" />
      </svg>
    </motion.div>
  );
}
