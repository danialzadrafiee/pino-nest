import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserEventsService } from './user-events.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: UserEventsService,
  ) {}

  async increaseAppleBalance({ gained_apples }: { gained_apples: number }) {
    const updatedUser = await this.prisma.user.update({
      where: { id: 1 },
      data: { apple_balance: { increment: gained_apples } },
    });
    this.eventsService.emitAppleBalanceUpdate(updatedUser.id, updatedUser.apple_balance);
    return updatedUser;
  }
}
