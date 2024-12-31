import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function main() {
  await prisma.userBusiness.upsert({
    where: {
      user_id_business_id: {
        user_id: 1,
        business_id: 1
      }
    },
    create: {
      user_id: 1,
      business_id: 1,
      level: 1
    },
    update: {
      level: 1
    }
  });

  await prisma.userBusiness.upsert({
    where: {
      user_id_business_id: {
        user_id: 1,
        business_id: 2
      }
    },
    create: {
      user_id: 1,
      business_id: 2,
      level: 5
    },
    update: {
      level: 5
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });