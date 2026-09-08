const http = require('http');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const p = await prisma.painting.findFirst();
  console.log('Testing view on painting:', p.id, 'current views_count:', p.views_count);

  const req = http.request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/paintings/' + p.id + '/view',
      method: 'POST',
    },
    (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', async () => {
        console.log('Response:', res.statusCode, d);
        const updated = await prisma.painting.findUnique({ where: { id: p.id } });
        console.log('Updated views_count:', updated.views_count);
        await prisma.$disconnect();
      });
    }
  );
  req.end();
}
test();
