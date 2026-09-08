const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const views = await prisma.paintingView.count();
  const visits = await prisma.siteVisit.count();
  const sold = await prisma.painting.count({ where: { is_sold: true } });
  const inquiries = await prisma.inquiry.count();

  console.log({ views, visits, sold, inquiries });
  await prisma.$disconnect();
}

run();
