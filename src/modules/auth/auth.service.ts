import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});
@Injectable()
export class AuthService {
  async getAuthUser() {
    const user = await prisma.user.findUnique({
      where: { id: 1 },
      include: { userBusinesses: { include: { business: true } } },
    });
    return {
      id: user.id,
      referrer_id: user.referrer_id,
      telegram_id: user.telegram_id,
      telegram_username: user.telegram_username,
      telegram_firstname: user.telegram_firstname,
      telegram_lastname: user.telegram_lastname,
      apple_balance: user.apple_balance,
      crickets_balance: user.crickets_balance,
      direct_referrals_count: user.direct_referrals_count,
      downline_referrals_count: user.downline_referrals_count,
      apple_per_second: user.apple_per_second,
      apple_per_tap: user.apple_per_tap,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      businesses: user.userBusinesses.map(ub => ({
        business_id: ub.business_id,
        user_id: ub.user_id
      }))
    };
  }
}
