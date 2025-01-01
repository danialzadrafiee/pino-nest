import { UserBusinessCalculationService } from './reward-engine/user-business-calculation.service';
import { UserBusinessController } from './user-business.controller';
import { UserBusinessService } from './user-business.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [UserBusinessController],
  providers: [UserBusinessService, UserBusinessCalculationService],
})
export class UserBusinessModule {}
