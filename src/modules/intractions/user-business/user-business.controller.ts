import {
  Controller,
  Post,
  Body,
  Get,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { UserBusinessService } from './user-business.service';
import { BatchPurchaseDto } from './dto/batch-purchase.dto';
import { UserBusinessCalculationService } from './reward-engine/user-business-calculation.service';

@Controller('user-business')
export class UserBusinessController {
  constructor(
    private readonly userBusinessCalculationService: UserBusinessCalculationService,
    private readonly userBusinessService: UserBusinessService,
  ) {}
  @Post('purchase')
  async batchPurchase(
    @Body(ValidationPipe) batchPurchaseDto: BatchPurchaseDto,
  ) {
    const { newLevel } =
      await this.userBusinessService.batchPurchase(batchPurchaseDto);
    return { message: 'success', new_level: newLevel };
  }
  @Get('rewards')
  async GetCalculatedUserRewards() {
    return await this.userBusinessCalculationService.getRewardCalculatedBusinesses();
  }
}
