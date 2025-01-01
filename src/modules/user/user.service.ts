import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserEventsService } from './user-events.service';
import { UserBusinessCalculationService } from '../user-business/services/user-business-reward-calculation.service';
import { Decimal } from 'decimal.js';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);
  private lastUpdateTime: number = Date.now();

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: UserEventsService,
    private readonly calculationService: UserBusinessCalculationService,
  ) {}

  async onModuleInit() {
    await this.updateApplePerSecond();
  }

  @Interval(1000) 
  async updateUserApples() {
    try {
      const currentTime = Date.now();
      const timeDiff = (currentTime - this.lastUpdateTime) / 1000;
      this.lastUpdateTime = currentTime;

      const { totalAps } = await this.calculationService.getRewardCalculatedBusinesses();
      
      // Use transaction for atomic update
      const updatedUser = await this.prisma.$transaction(async (prisma) => {
        // Calculate exact amount based on time passed
        const incrementAmount = Number(totalAps) * timeDiff;

        const user = await prisma.user.update({
          where: { id: 1 },
          data: {
            apple_balance: {
              increment: incrementAmount
            }
          }
        });

        return user;
      });

      this.eventsService.emitAppleBalanceUpdate(
        updatedUser.id,
        updatedUser.apple_balance,
      );

      await this.updateApplePerSecond();
    } catch (error) {
      this.logger.error('Failed to update user apples:', error);
    }
  }

  private async updateApplePerSecond() {
    try {
      const { totalAps } = await this.calculationService.getRewardCalculatedBusinesses();
      
      await this.prisma.user.update({
        where: { id: 1 },
        data: {
          apple_per_second: Number(totalAps)
        }
      });
    } catch (error) {
      this.logger.error('Failed to update apple_per_second:', error);
    }
  }

  async increaseAppleBalance({ 
    gained_apples, 
    source = 'idle' 
  }: { 
    gained_apples: number;
    source?: 'idle' | 'tap';
  }) {
    // Use transaction to ensure atomicity
    const updatedUser = await this.prisma.$transaction(async (prisma) => {
      // Get current user state
      const currentUser = await prisma.user.findUnique({
        where: { id: 1 }
      });

      if (!currentUser) {
        throw new Error('User not found');
      }

      // Update user with new balance
      const user = await prisma.user.update({
        where: { id: 1 },
        data: { 
          apple_balance: { 
            increment: gained_apples 
          }
        },
      });

      return user;
    });

    // Emit update through event service
    this.eventsService.emitAppleBalanceUpdate(
      updatedUser.id,
      updatedUser.apple_balance,
    );

    return updatedUser;
  }
}
