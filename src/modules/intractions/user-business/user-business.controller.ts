import { Controller, Post, Body, Get, ValidationPipe } from '@nestjs/common';
import { UserBusinessService } from './user-business.service';
import { BatchPurchaseDto } from './dto/batch-purchase.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Decimal } from 'decimal.js';
import { CRICKET_CONFIG } from 'src/common/constants/cricket.constants';
import { isTier } from './utils/type-guards';
import { Tier } from './types/tier.interface';
import { REFERRAL_CONFIG } from 'src/common/constants/referral.constants';

@Controller('user-business')
export class UserBusinessController {
  constructor(
    private readonly userBusinessService: UserBusinessService,
    private readonly prisma: PrismaService,
  ) {}
  @Post('purchase')
  async batchPurchase(
    @Body(ValidationPipe) batchPurchaseDto: BatchPurchaseDto,
  ) {
    const { newLevel } =
      await this.userBusinessService.batchPurchase(batchPurchaseDto);
    return { message: 'success', new_level: newLevel };
  }
  @Get('test')
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
          .filter(isTier)
          .filter(
            (tier) =>
              tier.achievement.type === 'global' && level >= tier.requiredLevel,
          )
          .reduce((sum, tier) => sum.plus(tier.achievement.multiplier), total);
      }, new Decimal(0))
      .toNumber();
    return globalAchievementMultipliers;
  }
  @Get('test2')
  async getGlobalCricketsMuiltiplier() {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: 1 } });
    const balance = user.crickets_balance ?? 0;
    return balance <= 0
      ? 1
      : 1 + balance * CRICKET_CONFIG.CRICKET_PROFIT_MULTIPLIER;
  }
  @Get('test3')
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
  @Get('test4')
  async getGlobalTotalMultiplier(): Promise<number> {
    const achievement = await this.getGlobalAchievementMultiplier();
    const referrals = await this.getGlobalReferralsMuiltiplier();
    const crickets = await this.getGlobalCricketsMuiltiplier();
    const total = achievement * crickets * referrals;
    return total;
  }

  @Get('test5')
  async getCalculatedBusinesses() {
    const globalMultiplier = await this.getGlobalTotalMultiplier();
    console.log(`Global Multiplier: ${globalMultiplier}`);

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
        ...userBusiness,
        currentAps,
        currentTapReward,
      };
    });

    return businesses;
  }
}
