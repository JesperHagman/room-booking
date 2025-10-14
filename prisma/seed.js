// app/prisma/seed.js (CommonJS)
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Nollställ tabeller för att undvika dubbletter vid upprepad seed
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();

  await prisma.room.createMany({
    data: [
      { name: 'Magnus',  capacity: 4 },
      { name: 'Aida',    capacity: 6 },
      { name: 'Svea',    capacity: 8 },
      { name: 'Enbacka', capacity: 10 },
      { name: 'Gröna',   capacity: 20 },
    ],
  });

  console.log('Seed done.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });