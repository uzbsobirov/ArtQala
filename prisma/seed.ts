import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Art Qala database...');

  // 1. Clean existing records
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.painting.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.otpVerification.deleteMany();

  // 2. Admin & Demo Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Anvar',
      email: 'admin@artqala.uz',
      password_hash: adminPassword,
      country: 'Uzbekistan',
      role: 'ADMIN',
      email_verified: true,
      auth_provider: 'EMAIL',
    },
  });

  const demoUserPassword = await bcrypt.hash('password123', 10);
  const demoUser = await prisma.user.create({
    data: {
      name: 'Emily Carter',
      email: 'emily.carter@example.com',
      password_hash: demoUserPassword,
      country: 'United Kingdom',
      role: 'USER',
      email_verified: true,
      auth_provider: 'EMAIL',
    },
  });

  // 3. Categories
  const catHistorical = await prisma.category.create({
    data: {
      slug: 'historical',
      name_en: 'Historical Monuments',
      name_ru: 'Исторические памятники',
      name_uz: 'Tarixiy obidalar',
    },
  });

  const catPortraits = await prisma.category.create({
    data: {
      slug: 'portraits',
      name_en: 'Portraits',
      name_ru: 'Портреты',
      name_uz: 'Portretlar',
    },
  });

  const catCourtyards = await prisma.category.create({
    data: {
      slug: 'courtyards',
      name_en: 'Courtyards & Homes',
      name_ru: 'Дворы и махалли',
      name_uz: 'Hovli-joylar va mahallalar',
    },
  });

  const catHandicraft = await prisma.category.create({
    data: {
      slug: 'handicrafts',
      name_en: 'Handicrafts & Ceramics',
      name_ru: 'Ремесла и керамика',
      name_uz: 'Hunarmandchilik va keramika',
    },
  });

  // 4. Artists
  const artistDilnoza = await prisma.artist.create({
    data: {
      name: 'Dilnoza Yusupova',
      initials: 'DY',
      specialty_en: 'HISTORICAL & ARCHITECTURE',
      specialty_ru: 'ИСТОРИЯ И АРХИТЕКТУРА',
      specialty_uz: 'TARIXIY VA ME\'MORIY OBIDALAR',
      bio_en: 'Paints Samarkand\'s monuments at golden hour. Trained at the Tashkent State Art Institute; with the gallery since 2019.',
      bio_ru: 'Пишет памятники Самарканда в золотой час. Выпускница Ташкентского художественного института, с галереей с 2019 года.',
      bio_uz: 'Samarqand obidalarini oltin shafaq paytida tasvirlaydi. Toshkent Davlat San\'at Institutini tamomlagan; 2019-yildan buyon galereya a\'zosi.',
    },
  });

  const artistSardor = await prisma.artist.create({
    data: {
      name: 'Sardor Rakhimov',
      initials: 'SR',
      specialty_en: 'PORTRAITS & COURTYARDS',
      specialty_ru: 'ПОРТРЕТЫ И ДВОРИКИ',
      specialty_uz: 'PORTRETLAR VA HOVLILAR',
      bio_en: 'Known for warm, intimate portraits of elders and everyday courtyard life across the old city.',
      bio_ru: 'Известен теплыми, камерными портретами старейшин и сценами жизни в старых двориках города.',
      bio_uz: 'Keksalarining iliq portretlari va qadimiy shahar hovlilaridagi hayot lavhalari bilan tanilgan.',
    },
  });

  const artistGulnora = await prisma.artist.create({
    data: {
      name: 'Gulnora Azimova',
      initials: 'GA',
      specialty_en: 'TEXTILE & HANDICRAFT',
      specialty_ru: 'ТЕКСТИЛЬ И РЕМЕСЛА',
      specialty_uz: 'TO\'QIMACHILIK VA HUNARMANDCHILIK',
      bio_en: 'Brings ikat and suzani motifs into oil and gouache. Also leads the gallery\'s ceramics workshop.',
      bio_ru: 'Воплощает мотивы иката и сюзане в масле и гуаши. Также руководит керамической мастерской галереи.',
      bio_uz: 'Ikat va so\'zana naqshlarini moybo\'yoq va guashda aks ettiradi. Galereyaning kulolchilik ustaxonasini boshqaradi.',
    },
  });

  const artistBekzod = await prisma.artist.create({
    data: {
      name: 'Bekzod Nurov',
      initials: 'BN',
      specialty_en: 'HISTORICAL MONUMENTS',
      specialty_ru: 'ИСТОРИЧЕСКИЕ МОНУМЕНТЫ',
      specialty_uz: 'TARIXIY YODGORLIKLAR',
      bio_en: 'Focuses on domes and skies — Gur-e-Amir, Bibi-Khanym and the mausoleums of the Shah-i-Zinda.',
      bio_ru: 'Фокусируется на куполах и небесах — Гур-Эмир, Биби-Ханым и мавзолеи Шахи-Зинда.',
      bio_uz: 'Gumbazlar va osmon manzaralariga e\'tibor qaratadi — Go\'ri Amir, Bibi Xonim va Shohi Zinda ziyoratgohlari.',
    },
  });

  const artistJasur = await prisma.artist.create({
    data: {
      name: 'Jasur Tashkentov',
      initials: 'JT',
      specialty_en: 'CERAMICS & OBJECTS',
      specialty_ru: 'КЕРАМИКА И ПРЕДМЕТЫ',
      specialty_uz: 'KULOLCHILIK VA BUYUMLAR',
      bio_en: 'Hand-throws and paints ceramic vases and tableware inspired by Rishtan and Gijduvan traditions.',
      bio_ru: 'Создает вручную керамические вазы и посуду, вдохновленные традициями Риштана и Гиждувана.',
      bio_uz: 'Rishton va G\'ijduvon an\'analari asosida kulolchilik buyumlari va idishlarini qo\'lda yasaydi hamda naqshlaydi.',
    },
  });

  // 5. Paintings
  const p1 = await prisma.painting.create({
    data: {
      title_en: 'Registon at Dusk',
      title_ru: 'Регистан на закате',
      title_uz: 'Registon shom payti',
      description_en: 'Oil on canvas view of the Registan ensemble at golden hour, capturing the intricate turquoise majolica glowing under the setting sun.',
      description_ru: 'Масляная живопись на холсте: ансамбль Регистан в лучах заката, золотистый свет и сияющая бирюзовая майолика.',
      description_uz: 'Registon me\'moriy majmuasi quyosh botishi arafasida. Oltin rang nur va yaltiragan feruza koshinlar uyg\'unligi.',
      size: '60 × 80 cm',
      technique_en: 'Oil on canvas',
      technique_ru: 'Холст, масло',
      technique_uz: 'Moybo\'yoq, polotno',
      year: 2024,
      price: 420,
      discount_price: 357,
      discount_starts_at: new Date('2026-09-01'),
      discount_ends_at: new Date('2026-10-01'),
      is_sold: false,
      is_featured: true,
      images: JSON.stringify(['/assets/p-arch.svg']),
      views_count: 412,
      artist_id: artistDilnoza.id,
      category_id: catHistorical.id,
    },
  });

  const p2 = await prisma.painting.create({
    data: {
      title_en: 'Gur-e-Amir Sky',
      title_ru: 'Небо Гур-Эмира',
      title_uz: 'Go\'ri Amir osmoni',
      description_en: 'The ribbed azure dome of Amir Timur\'s mausoleum rising into the deep blue Samarkand evening sky.',
      description_ru: 'Ребристый лазурный купол мавзолея Амира Тимура на фоне глубокого вечернего самаркандского неба.',
      description_uz: 'Amir Temur maqbarasining qovurg\'asimon feruza gumbazi va Samarqandning moviy oqshom osmoni.',
      size: '70 × 90 cm',
      technique_en: 'Oil on canvas',
      technique_ru: 'Холст, масло',
      technique_uz: 'Moybo\'yoq, polotno',
      year: 2024,
      price: 390,
      is_sold: false,
      is_featured: true,
      images: JSON.stringify(['/assets/p-dome.svg']),
      views_count: 298,
      artist_id: artistBekzod.id,
      category_id: catHistorical.id,
    },
  });

  const p3 = await prisma.painting.create({
    data: {
      title_en: 'The Weaver',
      title_ru: 'Ткачиха',
      title_uz: 'To\'quvchi ayol',
      description_en: 'An elder silk weaver seated before a traditional loom, working on vivid silk abrbandi threads.',
      description_ru: 'Пожилая мастерица за традиционным шелкоткацким станком, сплетающая яркие нити абрового шелка.',
      description_uz: 'An\'anaviy ipak to\'qish dastgohi oldida yorqin abrbandi iplarini to\'qiyotgan chevar ona siymosi.',
      size: '50 × 60 cm',
      technique_en: 'Gouache & oil on linen',
      technique_ru: 'Гуашь и масло на льне',
      technique_uz: 'Zig\'ir matoda guash va moybo\'yoq',
      year: 2023,
      price: 260,
      is_sold: true,
      is_featured: true,
      images: JSON.stringify(['/assets/p-portrait.svg']),
      views_count: 185,
      artist_id: artistGulnora.id,
      category_id: catPortraits.id,
    },
  });

  const p4 = await prisma.painting.create({
    data: {
      title_en: 'Bobom\'s Gaze',
      title_ru: 'Взгляд дедушки',
      title_uz: 'Bobomning nigohi',
      description_en: 'A profound portrait of a respected elder wearing a traditional chapan and doppa, holding freshly harvested pomegranates.',
      description_ru: 'Глубокий портрет аксакала в традиционном чапане и тюбетейке, держащего спелые гранаты.',
      description_uz: 'An\'anaviy chopon va do\'ppi kiygan, qo\'lida pishgan anor tutgan nuroniy oqsoqol portreti.',
      size: '55 × 70 cm',
      technique_en: 'Oil on canvas',
      technique_ru: 'Холст, масло',
      technique_uz: 'Moybo\'yoq, polotno',
      year: 2024,
      price: 310,
      is_sold: false,
      is_featured: false,
      images: JSON.stringify(['/assets/p-portrait.svg']),
      views_count: 140,
      artist_id: artistSardor.id,
      category_id: catPortraits.id,
    },
  });

  const p5 = await prisma.painting.create({
    data: {
      title_en: 'Old Bukhara Hovli',
      title_ru: 'Старый Бухарский дворик',
      title_uz: 'Eski Buxoro hovlisi',
      description_en: 'Sunlight filtering through carved wooden ayvan pillars into a quiet inner courtyard with grape vines.',
      description_ru: 'Солнечный свет сквозь резные деревянные колонны айвана в тихий внутренний дворик с виноградником.',
      description_uz: "O'yma yog'och ustunli ayvon orqali uzumzorli osoyishta ichki hovliga tushayotgan quyosh nurlari.",
      size: '65 × 85 cm',
      technique_en: 'Oil on wood panel',
      technique_ru: 'Масло по дереву',
      technique_uz: 'Yog\'och panelda moybo\'yoq',
      year: 2024,
      price: 310,
      is_sold: false,
      is_featured: true,
      images: JSON.stringify(['/assets/p-courtyard.svg']),
      views_count: 220,
      artist_id: artistSardor.id,
      category_id: catCourtyards.id,
    },
  });

  const p6 = await prisma.painting.create({
    data: {
      title_en: 'Evening in the Mahalla',
      title_ru: 'Вечер в махалле',
      title_uz: 'Mahallada oqshom',
      description_en: 'Warm clay walls and adobe archways glowing softly under lanterns in an ancient Samarkand mahalla.',
      description_ru: 'Теплые глинобитные стены и арки в мягком свете фонарей старой самаркандской махалли.',
      description_uz: 'Qadimiy Samarqand mahallasidagi paxsali devorlar va fonus nuri ostidagi sokin oqshom manzarasi.',
      size: '50 × 70 cm',
      technique_en: 'Oil on canvas',
      technique_ru: 'Холст, масло',
      technique_uz: 'Moybo\'yoq, polotno',
      year: 2023,
      price: 275,
      is_sold: false,
      is_featured: false,
      images: JSON.stringify(['/assets/p-courtyard.svg']),
      views_count: 118,
      artist_id: artistDilnoza.id,
      category_id: catCourtyards.id,
    },
  });

  const p7 = await prisma.painting.create({
    data: {
      title_en: 'Blue Suzani Vase',
      title_ru: 'Ваза "Синее сюзане"',
      title_uz: 'Moviy so\'zana guldon',
      description_en: 'Hand-thrown high-fired ceramic vase painted with cobalt flowerheads and antique pomegranate symbols.',
      description_ru: 'Керамическая ваза ручной формовки с кобальтовой росписью в стиле традиционных узоров сюзане.',
      description_uz: 'Kobalt rangli gullar va anor naqshlari bilan bezatilgan qo\'lda yasalgan nafis kulolchilik guldon.',
      size: '38 × 22 cm',
      technique_en: 'Glazed ceramics & pigments',
      technique_ru: 'Глазурованная керамика',
      technique_uz: 'Sirlangan keramika',
      year: 2024,
      price: 180,
      discount_price: 153,
      discount_starts_at: new Date('2026-09-01'),
      discount_ends_at: new Date('2026-09-30'),
      is_sold: false,
      is_featured: true,
      images: JSON.stringify(['/assets/p-handicraft.svg']),
      views_count: 165,
      artist_id: artistJasur.id,
      category_id: catHandicraft.id,
    },
  });

  const p8 = await prisma.painting.create({
    data: {
      title_en: 'Ikat Study No. 4',
      title_ru: 'Этюд иката № 4',
      title_uz: 'Ikat etyudi № 4',
      description_en: 'A geometric exploration of traditional Fergana Valley abrbandi diamond rhythms in earthy terracotta and turquoise.',
      description_ru: 'Геометрическое исследование ритмов ферганского иката в терракотовых и бирюзовых тонах.',
      description_uz: 'Farg\'ona vodiysi abrbandi ritmlarining terrakota va moviy ranglar uyg\'unligidagi geometrik talqini.',
      size: '45 × 45 cm',
      technique_en: 'Gouache on textured paper',
      technique_ru: 'Гуашь на фактурной бумаге',
      technique_uz: 'Fakturali qog\'ozda guash',
      year: 2024,
      price: 220,
      is_sold: false,
      is_featured: false,
      images: JSON.stringify(['/assets/p-diamond.svg']),
      views_count: 95,
      artist_id: artistGulnora.id,
      category_id: catHandicraft.id,
    },
  });

  // 6. Discounts
  await prisma.discount.create({
    data: {
      scope: 'PAINTING',
      target_id: p1.id,
      percent: 15,
      starts_at: new Date('2026-09-01'),
      ends_at: new Date('2026-10-01'),
      is_active: true,
    },
  });

  await prisma.discount.create({
    data: {
      scope: 'PAINTING',
      target_id: p7.id,
      percent: 15,
      starts_at: new Date('2026-09-01'),
      ends_at: new Date('2026-09-30'),
      is_active: true,
    },
  });

  // 7. Inquiries
  await prisma.inquiry.create({
    data: {
      guest_name: 'Emily Carter',
      guest_email: 'emily.carter@example.com',
      user_id: demoUser.id,
      painting_id: p1.id,
      status: 'NEW',
      message: 'Hi, I saw this painting on your site and I\'m visiting Samarkand next week — is it still available, and could you ship to London if I buy it?',
    },
  });

  await prisma.inquiry.create({
    data: {
      guest_name: 'Marco Rossi',
      guest_email: 'marco.rossi@example.it',
      painting_id: p5.id,
      status: 'IN_PROGRESS',
      message: 'Buonasera! What would be the packaging and courier fee for delivery to Milan?',
      admin_reply: 'Dear Marco, we provide custom wooden crate packaging with DHL Express.',
    },
  });

  await prisma.inquiry.create({
    data: {
      guest_name: 'Aigerim T.',
      guest_email: 'aigerim.t@almaty.kz',
      painting_id: p7.id,
      status: 'ANSWERED',
      message: 'Salom! Can this ceramic vase be reserved until Friday?',
      admin_reply: 'Assalomu alaykum Aigerim! Yes, we have reserved it for you until Friday.',
    },
  });

  // 8. Service Requests
  await prisma.serviceRequest.create({
    data: {
      guest_name: 'James Wu',
      guest_contact: 'james.wu@restaurant.uz / @jameswu_tg',
      service_type: 'MURAL',
      description: 'Mural request — café wall, Tashkent. Approximately 4x3 meters with oriental arches and pomegranate motifs.',
      status: 'IN_PROGRESS',
    },
  });

  await prisma.serviceRequest.create({
    data: {
      guest_name: 'Elena Smirnova',
      guest_contact: '+998 90 999 88 77',
      service_type: 'CUSTOM',
      description: 'Commission painting of our family courtyard in Bukhara from old photographs.',
      status: 'NEW',
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
