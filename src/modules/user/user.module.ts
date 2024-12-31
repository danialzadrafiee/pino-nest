import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserGateway } from './user.gateway';
import { UserEventsService } from './user-events.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserGateway, UserEventsService],
})
export class UserModule {}
