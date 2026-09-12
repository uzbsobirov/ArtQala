'use client';

import { motion } from 'framer-motion';

// Shamchiroq (mash'al motivi) — rassomlar profili iqtiboslari/bio yonida.
// 3 soniyalik mayin tebranish bilan doimiy yonib turadi.
export default function AnimatedShamchiroq() {
  return (
    <div className="inline-flex flex-col items-center opacity-80">
      <motion.svg
        animate={{ scale: [1, 1.08, 0.96, 1], opacity: [0.75, 1, 0.8, 0.75] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
      >
        <path
          d="M14 2 C 10 9, 10 16, 14 22 C 18 16, 18 9, 14 2 Z"
          stroke="#c59b27"
          strokeWidth="1.2"
          fill="#c59b27"
          fillOpacity="0.15"
        />
        <line x1="8" y1="24" x2="20" y2="24" stroke="#14201e" strokeWidth="1.4" />
        <line x1="10" y1="26.5" x2="18" y2="26.5" stroke="#14201e" strokeWidth="1" />
        <circle cx="14" cy="12" r="1.8" fill="#c59b27" />
      </motion.svg>
    </div>
  );
}
