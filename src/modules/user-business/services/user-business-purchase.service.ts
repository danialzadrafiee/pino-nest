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

  async create(userId: number, businessId: number) {
    await this.validateEntities(userId, businessId);

    try {
      return await this.prisma.userBusiness.create({
        data: {
          user_id: userId,
          business_id: businessId,
          level: this.INITIAL_LEVEL,
        },
        include: { business: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async batchPurchase(dto: BatchPurchaseDto) {
    return this.prisma.$transaction(async (tx) => {
      const [user] = await Promise.all([
        this.getUserWithBalance(tx),
        this.validateBusiness(tx, dto.business_id),
      ]);

      if (user.apple_balance < dto.total_cost) {
        throw this.createInsufficientBalanceError(
          user.apple_balance,
          dto.total_cost,
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

  private async validateEntities(userId: number, businessId: number) {
    const [user, business] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.business.findUnique({ where: { id: businessId } }),
    ]);

    if (!user) throw new Error(`User with ID ${userId} not found`);
    if (!business) throw new Error(`Business with ID ${businessId} not found`);
  }

  private async getUserWithBalance(tx: Prisma.TransactionClient) {
    return tx.user.findUnique({
      where: { id: this.DEFAULT_USER_ID },
      select: { apple_balance: true },
    });
  }

  private async validateBusiness(
    tx: Prisma.TransactionClient,
    businessId: number,
  ) {
    const business = await tx.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      this.logger.error(`Business with ID ${businessId} not found`);
      throw new Error('Business not found');
    }

    return business;
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

  private createInsufficientBalanceError(available: number, required: number) {
    this.logger.error(
      `Insufficient balance for user ID ${this.DEFAULT_USER_ID}. Required: ${required}, Available: ${available}`,
    );
    return new Error('Insufficient balance');
  }
}
