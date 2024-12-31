import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});
@Injectable()
export class AuthService {
  async getAuthUser() {
    const { userBusinesses, ...user } = await prisma.user.findUnique({
      where: { id: 1 },
      include: { userBusinesses: { include: { business: true } } },
    });
    
    return {
      ...user,
      businesses: userBusinesses.map(({ business_id, level }) => ({
        business_id,
        level
      }))
    };
  }
}
