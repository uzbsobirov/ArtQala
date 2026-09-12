// Bodomcha / Turunj (Xorazm bodomi) — rasm kartochkasi burchagida nozik hover
// detali. Ota-konteynerda Tailwind "group" klassi bo'lishi shart.
// Eslatma: PDF originalida top-3 right-3 tavsiya etilgan, lekin PaintingCard'da
// o'sha joyda wishlist (yurak) tugmasi bor — to'qnashmasligi uchun pastki
// o'ng burchakka ko'chirilgan.
export default function CardCornerBodom() {
  return (
    <div className="absolute bottom-3 right-3 pointer-events-none opacity-0 group-hover:opacity-85 transform scale-75 group-hover:scale-100 transition-all duration-300 ease-out">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 2 L 26 2 L 26 24" stroke="#c59b27" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M22 6 C 16 11, 16 17, 21 21 C 26 21, 28 15, 22 6 Z" stroke="#14201e" strokeWidth="1.1" fill="none" />
        <circle cx="21.5" cy="18.5" r="1.5" fill="#c59b27" />
      </svg>
    </div>
  );
}
