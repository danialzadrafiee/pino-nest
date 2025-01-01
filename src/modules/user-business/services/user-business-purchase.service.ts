import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BatchPurchaseDto } from '../dto/batch-purchase.dto';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class UserBusinessPurchaseService {
  private readonly logger = new Logger(UserBusinessPurchaseService.name);
  private readonly DEFAULT_USER_ID = 1;
  private readonly INITIAL_LEVEL = 1;

  constructor(private readonly prisma: PrismaService) {}

  async batchPurchase(dto: BatchPurchaseDto) {
    return this.prisma.$transaction(async (tx) => {
      const [user] = await Promise.all([this.getUserWithBalance(tx)]);

      if (user.apple_balance < dto.total_cost) {
        throw new Error(
          `Insufficient funds You have ${user.apple_balance} You need ${dto.total_cost}`,
        );
      }

      const userBusiness = await this.getOrCreateUserBusiness(
        tx,
        dto.business_id,
      );
      const newLevel = userBusiness.level + dto.purchase_amount;

      await Promise.all([
        this.updateUserBusinessLevel(tx, dto.business_id, newLevel),
        this.updateUserBalance(tx, user.apple_balance - dto.total_cost),
      ]);

      return { newLevel };
    });
  }

  private async getUserWithBalance(tx: Prisma.TransactionClient) {
    return tx.user.findUnique({
      where: { id: this.DEFAULT_USER_ID },
      select: { apple_balance: true },
    });
  }

  private async getOrCreateUserBusiness(
    tx: Prisma.TransactionClient,
    businessId: number,
  ) {
    const userBusiness = await tx.userBusiness.findUnique({
      where: {
        user_id_business_id: {
          user_id: this.DEFAULT_USER_ID,
          business_id: businessId,
        },
      },
      select: { level: true },
    });

    if (!userBusiness) {
      await tx.userBusiness.create({
        data: {
          user_id: this.DEFAULT_USER_ID,
          business_id: businessId,
          level: this.INITIAL_LEVEL,
        },
      });
      return { level: 0 };
    }

    return userBusiness;
  }

  private async updateUserBusinessLevel(
    tx: Prisma.TransactionClient,
    businessId: number,
    newLevel: number,
  ) {
    return tx.userBusiness.update({
      where: {
        user_id_business_id: {
          user_id: this.DEFAULT_USER_ID,
          business_id: businessId,
        },
      },
      data: { level: newLevel },
    });
  }

  private async updateUserBalance(
    tx: Prisma.TransactionClient,
    newBalance: number,
  ) {
    return tx.user.update({
      where: { id: this.DEFAULT_USER_ID },
      data: { apple_balance: newBalance },
    });
  }
}
