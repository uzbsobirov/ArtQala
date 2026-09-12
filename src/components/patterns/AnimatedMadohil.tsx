'use client';

import { motion } from 'framer-motion';

// Qosh-Madohil (gumbaz va peshtoq arkasi) — bo'lim sarlavhalari tepasida.
// Ekranga kirib kelganda ark chizig'i qalamda chizilgandek (pathLength) ochiladi.
export default function AnimatedMadohil() {
  return (
    <div className="flex justify-center items-center mb-2">
      <svg width="46" height="22" viewBox="0 0 46 22" fill="none">
        <motion.path
          d="M2 20 L 13 20 C 17 20, 19 6, 23 2 C 27 6, 29 20, 33 20 L 44 20"
          stroke="#c59b27"
          strokeWidth="1.3"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.9 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="23"
          cy="2"
          r="1.8"
          fill="#14201e"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, duration: 0.3 }}
        />
      </svg>
    </div>
  );
}
