import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const databaseUrl = process.env.DATABASE_URL || '';
const isNeon = databaseUrl.includes('neon.tech');

// Neon's HTTP driver adapter connects over HTTPS instead of the raw Postgres
// wire protocol (port 5432), which some local networks block or mishandle
// for non-standard-port TLS. Only applies when DATABASE_URL is actually a
// Neon host — a local/other Postgres uses Prisma's normal TCP connection.
const adapter = isNeon ? new PrismaNeon({ connectionString: databaseUrl }) : undefined;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(adapter ? { adapter } : {}),
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
