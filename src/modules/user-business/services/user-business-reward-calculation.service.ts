import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CRICKET_CONFIG } from 'src/common/constants/cricket.constants';
import { REFERRAL_CONFIG } from 'src/common/constants/referral.constants';
import { Decimal } from 'decimal.js';
import { Tier } from '../types/tier.interface';

@Injectable()
export class UserBusinessCalculationService {
  constructor(private readonly prisma: PrismaService) {}

  async getGlobalAchievementMultiplier(): Promise<Decimal> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: 1 },
      include: {
        userBusinesses: {
          include: {
            business: {
              select: {
                tiers: true,
              },
            },
          },
        },
      },
    });

    const globalAchievementMultipliers = user.userBusinesses.reduce(
      (total, { level, business }) => {
        if (!business?.tiers || !Array.isArray(business.tiers)) {
          return total;
        }

        const filteredTiers = (business.tiers as unknown as Tier[]).filter(
          (tier) => {
            const isGlobal = tier.achievement.type === 'global';
            const meetsLevel = level >= tier.requiredLevel;
            return isGlobal && meetsLevel;
          },
        );

        return filteredTiers.reduce((sum, tier) => {
          Logger.warn(
            `Adding multiplier: ${tier.achievement.multiplier} to sum: ${sum}`,
          );
          return sum.plus(new Decimal(tier.achievement.multiplier));
        }, total);
      },
      new Decimal(0),
    );

    return globalAchievementMultipliers.plus(1);
  }

  async getGlobalCricketsMuiltiplier(): Promise<Decimal> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: 1 } });
    const balance = new Decimal(user.crickets_balance ?? 0);

    return balance.lte(0)
      ? new Decimal(1)
      : new Decimal(1).plus(
          balance.times(CRICKET_CONFIG.CRICKET_PROFIT_MULTIPLIER),
        );
  }

  async getGlobalReferralsMuiltiplier(): Promise<Decimal> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: 1 } });
    const userDirectReferrals = new Decimal(user.direct_referrals_count ?? 0);
    const userDownlineReferrals = new Decimal(
      user.downline_referrals_count ?? 0,
    );

    const directMultiplier = userDirectReferrals.times(
      REFERRAL_CONFIG.DIRECT_INVITE_PROFIT_MULTIPLIER,
    );
    const downlineMultiplier = userDownlineReferrals.times(
      REFERRAL_CONFIG.DOWNLINE_INVITE_PROFIT_MULTIPLIER,
    );

    return directMultiplier.plus(downlineMultiplier).plus(1);
  }

  async getGlobalTotalMultiplier(): Promise<Decimal> {
    const [achievement, referrals, crickets] = await Promise.all([
      this.getGlobalAchievementMultiplier(),
      this.getGlobalReferralsMuiltiplier(),
      this.getGlobalCricketsMuiltiplier(),
    ]);

    const total = achievement.times(crickets).times(referrals);

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
          (multiplier, tier) =>
            multiplier.times(new Decimal(tier.achievement.multiplier)),
          new Decimal(1),
        );

      const currentAps = new Decimal(initial_aps)
        .times(selfMultiplier)
        .times(globalMultiplier);

      const currentTapReward = new Decimal(initial_tap_reward)
        .times(selfMultiplier)
        .times(globalMultiplier);

      return {
        business_id: userBusiness.business_id,
        currentAps,
        currentTapReward,
      };
    });

    const totalAps = businesses.reduce(
      (total, { currentAps }) => total.plus(currentAps),
      new Decimal(0),
    );

    const totalTapReward = businesses.reduce(
      (total, { currentTapReward }) => total.plus(currentTapReward),
      new Decimal(0),
    );

    return {
      businesses,
      totalAps,
      totalTapReward,
    };
  }
}
