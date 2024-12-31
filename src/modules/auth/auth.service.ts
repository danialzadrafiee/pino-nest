import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient({})
@Injectable()
export class AuthService {

  async getUserOne() {
    return (await prisma.user.findUnique({ where: { id: 1 } }))
  }
}
