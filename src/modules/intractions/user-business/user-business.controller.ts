import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { UserBusinessService } from './user-business.service';
import { BatchPurchaseDto } from './dto/batch-purchase.dto';

@Controller('user-business')
export class UserBusinessController {
  constructor(private readonly userBusinessService: UserBusinessService) {}

  @Post('purchase')
//   @UsePipes(new ValidationPipe())
  async batchPurchase(@Body() batchPurchaseDto: BatchPurchaseDto) {
    
    try {
      const result = await this.userBusinessService.batchPurchase(batchPurchaseDto);
      return {
        message: 'success',
        new_level: result.newLevel
      };
    } catch (error) {
      throw new HttpException({
        message: 'Purchase failed',
        error: error.message
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
