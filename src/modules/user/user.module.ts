import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import { UserEventsService } from './user-events.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [UserService, UserGateway, UserEventsService],
  exports: [UserService],
})
export class UserModule {}
