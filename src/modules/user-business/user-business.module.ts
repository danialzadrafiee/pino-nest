import { UserBusinessCalculationService } from './services/user-business-reward-calculation.service';
import { UserBusinessController } from './user-business.controller';
import { UserBusinessPurchaseService } from './services/user-business-purchase.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [UserBusinessController],
  providers: [UserBusinessPurchaseService, UserBusinessCalculationService],
  exports: [UserBusinessCalculationService],
})
export class UserBusinessModule {}
