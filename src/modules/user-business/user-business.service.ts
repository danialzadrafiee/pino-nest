import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BatchPurchaseDto } from './dto/batch-purchase.dto';

@Injectable()
export class UserBusinessService {
  private readonly logger = new Logger(UserBusinessService.name);

  constructor(private readonly prisma: PrismaService) {}

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
