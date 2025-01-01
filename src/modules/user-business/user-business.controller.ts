import {
  Controller,
  Post,
  Body,
  Get,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { UserBusinessPurchaseService } from './services/user-business-purchase.service';
import { BatchPurchaseDto } from './dto/batch-purchase.dto';
import { UserBusinessCalculationService } from './services/user-business-reward-calculation.service';

@Controller('user-business')
export class UserBusinessController {
  constructor(
    private readonly userBusinessCalculationService: UserBusinessCalculationService,
    private readonly userBusinessService: UserBusinessPurchaseService,
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
