import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export interface AppleBalanceUpdate {
  userId: number;
  newBalance: number;
}

@Injectable()
export class UserEventsService {
  private appleBalanceUpdate = new Subject<AppleBalanceUpdate>();

  appleBalanceUpdate$ = this.appleBalanceUpdate.asObservable();

  emitAppleBalanceUpdate(userId: number, newBalance: number) {
    this.appleBalanceUpdate.next({ userId, newBalance });
  }
}
