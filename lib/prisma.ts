import { PrismaClient } from '@prisma/client';

// Vi sparar instansen i globalThis så Next.js inte skapar nya vid hot reload
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  });

// I dev-läge, återanvänd samma instans
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;