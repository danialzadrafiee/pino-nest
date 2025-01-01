import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BatchPurchaseDto } from './dto/batch-purchase.dto';

@Injectable()
export class UserBusinessService {
  private readonly logger = new Logger(UserBusinessService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, businessId: number) {
    try {
      // Check if business exists
      const business = await this.prisma.business.findUnique({
        where: { id: businessId },
      });

      if (!business) {
        this.logger.error(`Business with ID ${businessId} not found`);
        throw new Error('Business not found');
      }

      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        this.logger.error(`User with ID ${userId} not found`);
        throw new Error('User not found');
      }

      // Create user business relationship
      return await this.prisma.userBusiness.create({
        data: {
          user_id: userId,
          business_id: businessId,
          level: 1, // Default starting level
        },
        include: {
          business: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        this.logger.error(`UserBusiness already exists for user ${userId} and business ${businessId}`);
        throw new Error('UserBusiness relationship already exists');
      }
      throw error;
    }
  }

  async batchPurchase(batchPurchaseDto: BatchPurchaseDto) {
    const { business_id, purchase_amount, total_cost } = batchPurchaseDto;

    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({
        where: { id: 1 },
        select: { apple_balance: true },
      });

      const userBusiness = await prisma.userBusiness.findUnique({
        where: { id: business_id },
        select: { level: true },
      });

      if (!userBusiness) {
        this.logger.error(`Business with ID ${business_id} not found`);
        throw new Error('Business not found');
      }

      if (user.apple_balance < total_cost) {
        this.logger.error(
          `Insufficient balance for user ID 1. Required: ${total_cost}, Available: ${user.apple_balance}`,
        );
        throw new Error('Insufficient balance');
      }

      const newLevel = (userBusiness.level || 0) + purchase_amount;
      await prisma.userBusiness.update({
        where: { id: business_id },
        data: { level: newLevel },
      });

      // Update user balance
      const newAppleBalance = user.apple_balance - total_cost;
      await prisma.user.update({
        where: { id: 1 },
        data: { apple_balance: newAppleBalance },
      });

      return { newLevel };
    });
  }
}
