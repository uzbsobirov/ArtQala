# Art Qala — Gallery Website — Project Rules for Antigravity

Bu papka "Art Qala" san'at galereyasi (O'zbekiston) uchun sayt qurish loyihasi. Quyidagi qoidalarga qat'iy amal qil.

## 1. Loyiha haqida
To'liq texnik topshiriq (TZ) — barcha sahifalar, funksiyalar, admin panel, ma'lumotlar bazasi tuzilishi, dizayn ranglari — `/TZ/ArtQala_TZ.docx` (yoki `/TZ/ArtQala_TZ.pdf`) faylida. Kod yozishdan oldin shu hujjatni to'liq o'qib chiq.

## 2. Dizayn — MUHIM
- Vizual dizayn namunasi: `/design/design-preview.html` — buni brauzerda och va sayt qanday ko'rinishi kerakligini ko'r (rang, animatsiya, joylashuv, umumiy uslub).
- Admin panel ekranlari: `/design/screenshots/*.png`.
- Dizayn manba fayllari (component-larga bo'lingan holda, faqat referens uchun, to'g'ridan-to'g'ri ishlatilmaydi): `/design/source/*.dc.html`.
- Sayt logotipi: `/assets/logo.png` (fon olib tashlangan, tayyor holatda).

### LOGO — HECH QACHON O'ZGARTIRMA
`/assets/logo.png` faylini HECH QACHON tahrirlamaslik, qayta chizmaslik, ranglarini o'zgartirmaslik, boshqa logo bilan almashtirmaslik kerak. Bu asl, tasdiqlangan logo. Uni Header va Footer komponentlarida ORIGINAL holatida ishlat. Agar biror joyda logo "mos kelmayapti" deb tuyulsa ham — teginma, savol ber.

## 3. Tavsiya etilgan texnik stack
- Frontend: **Next.js** (App Router) + **TailwindCSS**
- Backend/DB: **PostgreSQL** + **Prisma** ORM
- Autentifikatsiya: **NextAuth.js** — email/parol + Google va Apple orqali kirish, email OTP tasdiqlash
- Ko'p tillilik (EN/RU/UZ): **next-intl**
- Email yuborish (OTP): **Resend** (bepul: kuniga 100, oyiga 3000 ta)
- Rasm saqlash: **Cloudinary** yoki **Vercel Blob**
- Valyuta almashtirish (USD/UZS/RUB/EUR): tashqi exchange-rate API (masalan exchangerate-api.com bepul tarifi)
- Hosting: **Vercel**

## 4. Qurilish tartibi (bosqichma-bosqich)
1. Next.js loyiha skeletoni + Prisma schema (paintings, artists, categories, discounts, orders/inquiries, service_requests, users, reviews jadvallari — TZ dagi bo'lim 5 ga qarang)
2. Umumiy komponentlar: Header, Footer (logo, navigatsiya, til/valyuta almashtirgich) — dizaynga mos
3. Mijoz sahifalari: Home, Gallery (filtrlar bilan), Artists, Services, Contact
4. Autentifikatsiya: signup/signin, email OTP, Google/Apple login, wishlist (ro'yxatdan o'tmasdan ham ishlaydi)
5. Mijoz kabineti (dashboard): buyurtmalar tarixi, wishlist, profil
6. Admin panel: paintings CRUD, artists/categories, skidka tizimi (bir nechta ustuvorlik darajasi — TZ bo'lim 3 ga qara), inquiries/orders boshqaruvi, service requests, statistika
7. Sertifikat, sharhlar (reviews), Privacy/Terms sahifalari
8. Test, tekshirish, deploy (Vercel)

Har bosqichdan keyin to'xtab, natijani (screenshot/browser preview orqali) tekshirib chiq, keyin keyingi bosqichga o't.

## 5. Tillar
Butun sayt EN/RU/UZ (lotin) tillarida bo'lishi kerak. UZ matnlarda faqat lotin alifbosi ishlatiladi, kirill emas.

## 6. Qo'shimcha talablar (TZ bo'lim 8 ga qarang, to'liq tafsilotlar shu yerda)
Bular hammasi TZ hujjatining "8. Qo'shimcha talablar va tuzatishlar" bo'limida batafsil yozilgan — quyida faqat qisqa ro'yxat, implementatsiyadan oldin TZ dagi to'liq matnni o'qi:

- **Admin panelni himoyalash**: `/admin` yo'li faqat role="admin" bo'lgan, tizimga kirgan foydalanuvchiga ochiq bo'lsin (NextAuth session + middleware tekshiruvi). To'g'ridan-to'g'ri link orqali ham begona kirolmasin.
- **Paintings formasi**: rassom/kategoriya tanlov ro'yxatlaridan turib yangisini qo'shish imkoniyati ("+ Yangi qo'shish" modal). O'lcham (size) maydoni tuzilgan input bo'lsin (eni × bo'yi + birlik), erkin matn emas.
- **Rasm yuklash, Artist/Category qo'shish** — bular real backend (DB + Cloudinary/Vercel Blob) ulanganidan keyin ishlaydi; buni birinchi bosqichda ishlaydigan qilib qurish kerak (statik maketda ishlamasligi normal edi, lekin haqiqiy saytda albatta ishlashi shart).
- **Inquiries vs Service Requests**: Inquiries — mavjud kartina haqidagi so'rov; Service Requests — yangi xizmat (mural/keramika/custom) so'rovi. Alohida jadval va admin bo'lim.
- **Valyuta kurslari**: USD/EUR/RUB O'zbekiston Markaziy banki (cbu.uz) API'sidan avtomatik yangilanadi + Settings'da qo'lda tuzatish imkoniyati ham bo'lsin.
- **Settings**: galereya nomi, telefon, manzil, joylashuv/xarita, ish vaqti, ijtimoiy tarmoqlar, "Biz haqimizda" matni (3 tilda) — hammasi shu yerdan tahrirlanadigan bo'lsin.
- **Sign up**: davlat tanlovida to'liq davlatlar ro'yxati; parol — ikki marta kiritish (tasdiqlash), kamida 8 belgi, kamida 1 ta katta harf va 1 ta raqam.
- **Bosh sahifa hero rasmi**: bitta statik rasm emas, bir nechta rasm orasida avtomatik almashinadigan carousel.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
