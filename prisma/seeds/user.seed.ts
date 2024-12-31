import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function main() {
  await prisma.user.upsert({
    where: { telegram_id: 123 },
    create: {
      telegram_id: 123,
      telegram_username: 'demo_user',
      telegram_firstname: 'Demo',
      telegram_lastname: 'User',
      apple_balance: 500,
      crickets_balance: 0,
      apple_per_second: 1,
      apple_per_tap: 1,
      direct_referrals_count: 0,
      downline_referrals_count: 0
    },
    update: {
      telegram_username: 'demo_user',
      telegram_firstname: 'Demo',
      telegram_lastname: 'User',
      apple_balance: 500,
      crickets_balance: 0,
      apple_per_second: 1,
      apple_per_tap: 1,
      direct_referrals_count: 0,
      downline_referrals_count: 0
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