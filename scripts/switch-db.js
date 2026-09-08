const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const target = process.argv[2]; // 'postgres' or 'sqlite'
if (!target || !['postgres', 'postgresql', 'sqlite'].includes(target.toLowerCase())) {
  console.error("Usage: node scripts/switch-db.js <sqlite|postgres>");
  process.exit(1);
}

const isPostgres = target.toLowerCase().startsWith('postgres');
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

let content = fs.readFileSync(schemaPath, 'utf8');

if (isPostgres) {
  content = content.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  console.log('✓ Switched Prisma provider to "postgresql"');
} else {
  content = content.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  console.log('✓ Switched Prisma provider to "sqlite"');
}

fs.writeFileSync(schemaPath, content, 'utf8');

try {
  console.log('Running `npx prisma generate`...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✓ Prisma client generated successfully!');
} catch (e) {
  console.log('Note: `npx prisma generate` will run during build or when dev server restarts.');
}
