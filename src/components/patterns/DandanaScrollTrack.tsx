'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Dandana (Qala tishli devori) — galereya pastki hoshiyasi. Ustun to'lqiniga
// qarama-qarshi (o'ngdan chapga) yuruvchi counter-parallax lenta.
export default function DandanaScrollTrack() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], [60, -90]);

  return (
    <div ref={ref} className="w-full overflow-hidden py-2 opacity-35 select-none pointer-events-none">
      <motion.div style={{ x }} className="flex whitespace-nowrap">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="inline-flex items-center mx-1">
            <svg width="120" height="18" viewBox="0 0 120 18" fill="none">
              <path
                d="M0 14 L 15 4 L 30 14 L 45 4 L 60 14 L 75 4 L 90 14 L 105 4 L 120 14"
                stroke="#14201e"
                strokeWidth="1"
                fill="none"
              />
              <line x1="0" y1="16" x2="120" y2="16" stroke="#c59b27" strokeWidth="1" />
            </svg>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
