import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CRICKET_CONFIG } from 'src/common/constants/cricket.constants';
import { REFERRAL_CONFIG } from 'src/common/constants/referral.constants';
import { Decimal } from 'decimal.js';
import { Tier } from '../types/tier.interface';

@Injectable()
export class UserBusinessCalculationService {
  constructor(private readonly prisma: PrismaService) {}

  async getGlobalAchievementMultiplier(): Promise<number> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: 1 },
      include: {
        userBusinesses: {
          include: { business: { select: { tiers: true } } },
        },
      },
    });
    const globalAchievementMultipliers = user.userBusinesses
      .reduce((total, { level, business }) => {
        if (!business?.tiers || !Array.isArray(business.tiers)) return total;
        return (business.tiers as unknown as Tier[])
          .filter(
            (tier) =>
              tier.achievement.type === 'global' && level >= tier.requiredLevel,
          )
          .reduce((sum, tier) => sum.plus(tier.achievement.multiplier), total);
      }, new Decimal(0))
      .toNumber();
    return globalAchievementMultipliers;
  }

  async getGlobalCricketsMuiltiplier() {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: 1 } });
    const balance = user.crickets_balance ?? 0;
    return balance <= 0
      ? 1
      : 1 + balance * CRICKET_CONFIG.CRICKET_PROFIT_MULTIPLIER;
  }

  async getGlobalReferralsMuiltiplier(): Promise<number> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: 1 } });
    const user_direct_referrals = user.direct_referrals_count ?? 0;
    const user_downline_referrals = user.downline_referrals_count ?? 0;
    const direct_multiplier =
      user_direct_referrals * REFERRAL_CONFIG.DIRECT_INVITE_PROFIT_MULTIPLIER;
    const downline_multiplier =
      user_downline_referrals *
      REFERRAL_CONFIG.DOWNLINE_INVITE_PROFIT_MULTIPLIER;
    const total_multiplier = direct_multiplier + downline_multiplier + 1;

    return total_multiplier;
  }

  async getGlobalTotalMultiplier(): Promise<number> {
    const achievement = await this.getGlobalAchievementMultiplier();
    const referrals = await this.getGlobalReferralsMuiltiplier();
    const crickets = await this.getGlobalCricketsMuiltiplier();
    const total = achievement * crickets * referrals;
    Logger.log(
      `achievement: ${achievement}, crickets: ${crickets}, referrals: ${referrals}, total: ${total}`,
    );
    return total;
  }

  async getRewardCalculatedBusinesses() {
    const globalMultiplier = await this.getGlobalTotalMultiplier();
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: 1 },
      include: {
        userBusinesses: {
          include: {
            business: {
              select: {
                initial_aps: true,
                initial_tap_reward: true,
                tiers: true,
              },
            },
          },
        },
      },
    });
    const businesses = user.userBusinesses.map((userBusiness) => {
      const { level, business } = userBusiness;
      const { initial_aps, initial_tap_reward, tiers } = business;
      const tierArray = tiers as Array<{
        requiredLevel: number;
        achievement: { type: string; multiplier: number };
      }>;
      const selfMultiplier = tierArray
        .filter(
          (tier) =>
            tier.achievement.type === 'self' && level >= tier.requiredLevel,
        )
        .reduce(
          (multiplier, tier) => multiplier * tier.achievement.multiplier,
          1,
        );
      const currentAps = initial_aps * selfMultiplier * globalMultiplier;
      const currentTapReward =
        initial_tap_reward * selfMultiplier * globalMultiplier;

      return {
        business_id: userBusiness.business_id,
        currentAps,
        currentTapReward,
      };
    });
    const totalAps = businesses.reduce(
      (total, { currentAps }) => total + currentAps,
      0,
    );
    const totalTapReward = businesses.reduce(
      (total, { currentTapReward }) => total + currentTapReward,
      0,
    );
    return { businesses, totalAps, totalTapReward };
  }
}
