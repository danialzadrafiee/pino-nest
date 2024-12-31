import { UserService } from './user.service';
import { UserEventsService } from './user-events.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [UserService, UserEventsService],
  exports: [UserService, UserEventsService],
})
export class UserModule {}
