import { PrismaClient } from '@prisma/client';
import { seedAvailability, seedItems, seedLocations } from '../src/lib/seedData';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.itemAvailability.deleteMany();
  await prisma.item.deleteMany();
  await prisma.location.deleteMany();

  await prisma.location.createMany({ data: [...seedLocations] });
  await prisma.item.createMany({ data: [...seedItems] });
  await prisma.itemAvailability.createMany({
    data: seedAvailability.map((entry) => ({
      ...entry,
      isActive: true,
    })),
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
