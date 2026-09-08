# Art Qala — San'at Galereyasi Veb-sayti

Samarqand shahridagi "Art Qala" san'at galereyasi uchun zamonaviy, nafis va to'liq funksional veb-platforma.

Ushbu loyiha [AGENTS.md](./AGENTS.md) qoidalari hamda [TZ/ArtQala_TZ.docx](./TZ/ArtQala_TZ.docx) talablariga to'liq muvofiq ishlab chiqilgan.

---

## Asosiy Imkoniyatlar

### Mijoz Qismi (Public Gallery)
- **Tungi Galereya Hero**: Animatsion Ikat naqshi drifti, spotlight effekti, suzuvchi Registon asari va oltin jilo beruvchi sarlavha.
- **Ko'p Tillilik (i18n)**: Inglizcha (**EN** — asosiy), Ruscha (**RU**), O'zbekcha (**UZ** — faqat Lotin alifbosida).
- **Valyuta Konvertori**: **USD ($)**, **UZS (so'm)**, **RUB (₽)**, **EUR (€)** jonli kurslari.
- **Galereya & Filtrlar**: Tarixiy obidalar, Portretlar, Hovli-joylar, Hunarmandchilik mavzusi bo'yicha filtrlar, qidiruv va narxlar.
- **Kartina Batafsil**: O'lcham, texnika, yaratilgan yili, sertifikat kafolati va to'g'ridan-to'g'ri kuratorga so'rov yuborish.
- **Rassomlar Kataloogi**: Samarqandlik usta rassomlar profili, biografiyalari va portfolio topshirish imkoniyati.
- **Xizmatlar**: Mural (devoriy rasm), mualliflik keramikasi va buyurtma kartinalar uchun narx so'rash formasi.
- **Aloqa**: Samarqand galereyasi manzili, ish vaqti, ijtimoiy tarmoqlar va animatsion geo-pinli interaktiv xarita.
- **Asillik Sertifikati**: Har bir original kartina uchun galereya oltin muhri va rassom/kurator imzosi bilan rasmiy chop etiladigan (print-ready) sertifikat.

### Foydalanuvchi & Sevimlilar (Auth & Wishlist)
- **Ro'yxatdan o'tish & Kirish**: Ism, davlat, email va parol.
- **Email OTP**: 6 xonali tasdiqlash kodi bilan hisobni faollashtirish.
- **Wishlist (Sevimlilar)**: Ro'yxatdan o'tmasdan ham brauzerda ishlaydi, hisobga kirganda esa sinxronlanadi.
- **Mijoz Kabineti (`/account`)**: Yuborilgan so'rovlar holati (*Under Review, In Progress, Answered, Completed*), kurator javoblari, saqlangan asarlar va profil.

### Admin Panel (`/admin`)
- **Dizayn**: Qulay boshqaruv paneli (`#1D100B` sidebar, `#FAF4EC` fon).
- **Dashboard**: Asosiy statistika (kartinalar soni, yangi so'rovlar, faol aksiyalar), oxirgi so'rovlar va eng ko'p ko'rilgan asarlar.
- **Paintings CRUD**: Qidiruv, filtrlar, yangi kartina qo'shish, rasm yuklash, narx va skidka belgilash, "Mark as Sold" va "Featured on homepage" kalitlari.
- **4-Darajali Chegirma Tizimi**:
  1. *Kartinaning o'z skidkasi* (eng yuqori)
  2. *Rassom katalogi skidkasi*
  3. *Kategoriya skidkasi*
  4. *Sayt bo'yicha umumiy skidka* (eng quyi)
  Avtomatik amal qilish muddati (boshlanish va tugash sanalari).
- **So'rovlar (Inquiries)**: 2 ustunli boshqaruv paneli, mijozga javob yozish va holatni yangilash.
- **Xizmat So'rovlari**: Mural va keramika buyurtmalari ro'yxati va kurator qaydlari.
- **Mijozlar & Sharhlar moderatsiyasi**.

---

## Texnologik Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Shriftlar**: Google Fonts (`Cormorant Garamond` & `Work Sans`)
- **Backend & Database**: [Prisma ORM](https://www.prisma.io/) + SQLite (lokal test) / PostgreSQL (production)
- **Ikonkalar**: [Lucide React](https://lucide.dev/)
- **Xavfsizlik**: `bcryptjs` parollarni shifrlash va himoyalangan sessiya kukilari
- **Hosting**: [Vercel](https://vercel.com/)

---

## Lokal O'rnatish va Ishga Tushirish

### 1. Repositoryni yuklab oling va paketlarni o'rnating
```bash
cd ArtQala
npm install
```

### 2. Muhit o'zgaruvchilarini sozlang
`.env.example` faylidan nusxa oling:
```bash
cp .env.example .env
```

### 3. Ma'lumotlar bazasini yarating va to'ldiring
```bash
# Bazani yaratish (dev.db)
npx prisma db push

# Dastlabki 8 ta asar, rassomlar, kategoriyalar va so'rovlarni yuklash
npm run seed
```

### 4. Dasturni ishga tushiring
```bash
npm run dev
```
Brauzerda oching: [http://localhost:3000](http://localhost:3000)

---

## Dastlabki Hisoblar (Test Uchun)

- **Admin Paneli**:
  - URL: [http://localhost:3000/admin](http://localhost:3000/admin)
  - Email: `admin@artqala.uz`
  - Parol: `admin123`
- **Mijoz Demo Hisobi**:
  - Email: `emily.carter@example.com`
  - Parol: `password123`

---

## Vercel'ga Joylashtirish (Deploy)

1. Ushbu loyihani o'z GitHub hisobingizga yuklang:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Art Qala gallery platform"
   git remote add origin https://github.com/USERNAME/ArtQala.git
   git push -u origin master
   ```
2. [Vercel](https://vercel.com/) platformasiga kiring va loyihani import qiling.
3. Environment variables bo'limiga quyidagilarni kiriting:
   - `DATABASE_URL`: PostgreSQL ulanish manzili (masalan [Neon](https://neon.tech/) yoki Vercel Postgres)
   - `NEXTAUTH_SECRET`: Istalgan maxfiy kalit
   - `NEXTAUTH_URL`: Sizning Vercel domeningiz (masalan `https://artqala.vercel.app`)
4. **Deploy** tugmasini bosing!
