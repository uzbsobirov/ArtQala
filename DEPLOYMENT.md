# Art Qala — Vercel & PostgreSQL Deployment Guide (Deploy qo'llanmasi)

Ushbu qo'llanmada "Art Qala" veb-saytini **Vercel** serveriga va bulutli **PostgreSQL** ma'lumotlar bazasiga (Neon yoki Supabase) qadam-baqadam joylashtirish (deploy) ko'rsatilgan.

---

## 1. Ma'lumotlar bazasini tayyorlash (Bepul PostgreSQL)

Mahalliy rejimda sayt SQLite (`prisma/dev.db`) dan foydalanadi. Vercel serverless tizim bo'lgani sababli, ishlab chiqarish (production) muhitida PostgreSQL kerak bo'ladi.

### Tavsiya etilgan bepul PostgreSQL xizmatlari:
1. **Neon Serverless Postgres** (Tavsiya qilinadi — tez va qulay): [https://neon.tech](https://neon.tech)
2. **Supabase Postgres**: [https://supabase.com](https://supabase.com)
3. **Vercel Postgres**: Vercel Storage bo'limidan to'g'ridan-to'g'ri ulash mumkin.

### Qadamlar:
1. Neon.tech da ro'yxatdan o'ting va yangi loyiha (`artqala-db`) oching.
2. Berilgan `DATABASE_URL` (Connection string) ni nusxalang. Masalan:
   ```
   postgresql://artqala_owner:password@ep-sample-12345.eu-central-1.aws.neon.tech/artqala?sslmode=require
   ```

---

## 2. Prisma-ni PostgreSQL-ga o'tkazish

Loyihani PostgreSQL-ga o'tkazish uchun bitta buyruq kifoya:

```bash
npm run db:postgres
```

Bu buyruq `prisma/schema.prisma` dagi `provider = "sqlite"` ni `provider = "postgresql"` ga o'zgartiradi va Prisma Client-ni qayta tuzadi.

> *Qayta SQLite-ga qaytarish kerak bo'lsa:*
> ```bash
> npm run db:sqlite
> ```

---

## 3. Bulutli bazaga jadvallarni va namuna ma'lumotlarni yuklash

Terminalda quyidagi buyruqlarni bajaring:

```bash
# 1. PostgreSQL ulanish manzilini o'rnating (PowerShell misolida):
$env:DATABASE_URL="postgresql://artqala_owner:password@ep-sample-12345.eu-central-1.aws.neon.tech/artqala?sslmode=require"

# 2. Barcha jadvallarni (Paintings, Artists, Categories, Discounts, etc.) yaratish:
npx prisma db push

# 3. Asl rasmlar, toifalar va admin akkauntni yuklash (Seed):
npm run seed
```

Natijada PostgreSQL bazangizda 8 ta san'at asari, 5 ta rassom, 4 ta toifa, chegirmalar va admin akkaunt (`admin@artqala.uz` / `admin123`) tayyor bo'ladi.

---

## 4. GitHub-ga yuklash

Agar hali GitHub repozitoriy ochilmagan bo'lsa:

1. [GitHub.com](https://github.com) saytida yangi repozitoriy oching: `ArtQala`
2. Terminalda:
   ```bash
   git init -b main
   git add .
   git commit -m "feat: complete Art Qala gallery website"
   git remote add origin https://github.com/<sizning-github-profilingiz>/ArtQala.git
   git push -u origin main
   ```

---

## 5. Vercel-ga deploy qilish

### Usul 1: Vercel Dashboard orqali (Tavsiya qilinadi)
1. [Vercel.com](https://vercel.com) ga kiring (GitHub orqali).
2. **"Add New Project"** tugmasini bosing va `ArtQala` repozitoriyasini tanlang.
3. **Environment Variables** bo'limiga quyidagi o'zgaruvchilarni kiriting:
   - `DATABASE_URL`: PostgreSQL connection string (1-bosqichda olingan)
   - `NEXTAUTH_SECRET`: Istalgan xavfsiz kalit (masalan: `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Saytingiz Vercel domeni (masalan: `https://artqala.vercel.app`)
4. **"Deploy"** tugmasini bosing!
5. 1-2 daqiqa ichida saytingiz butun dunyoga jonli efirga chiqadi.

### Usul 2: Vercel CLI orqali
```bash
npm i -g vercel
vercel
```

---

## 6. Kirish ma'lumotlari (Production)

- **Admin panel**: `https://sizning-domen.vercel.app/admin`
  - Login: `admin@artqala.uz`
  - Parol: `admin123`
- **Mijoz demo kabineti**: `https://sizning-domen.vercel.app/signin`
  - Login: `emily.carter@example.com`
  - Parol: `password123`

---

## 7. Qo'shimcha jonli xizmatlar (ixtiyoriy)

- **Email OTP yuborish**: [Resend.com](https://resend.com) dan bepul API kalit olib, Vercel-ga `RESEND_API_KEY` o'zgaruvchisini qo'shing.
- **Rasm saqlash**: Vercel Blob yoki Cloudinary (`CLOUDINARY_URL`).
