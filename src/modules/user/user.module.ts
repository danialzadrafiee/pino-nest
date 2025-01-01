import { UserService } from './user.service';
import { UserEventsService } from './user-events.service';
import { Module } from '@nestjs/common';
import { UserBusinessModule } from '../user-business/user-business.module';

@Module({
  imports: [UserBusinessModule],
  providers: [UserService, UserEventsService],
  exports: [UserService, UserEventsService],
})
export class UserModule {}
