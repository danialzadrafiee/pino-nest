import { Prisma } from '@prisma/client';

export async function seedUser(prisma: Prisma.TransactionClient) {
  await prisma.user.upsert({
    where: {
      telegram_id: 123
    },
    update: {},
    create: {
      referrer_id: 0,
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
    }
  });
}
