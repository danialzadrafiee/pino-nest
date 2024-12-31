import { UserBusinessController } from './user-business.controller';
import { UserBusinessService } from './user-business.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [UserBusinessController],
  providers: [UserBusinessService],
})
export class UserBusinessModule {}
