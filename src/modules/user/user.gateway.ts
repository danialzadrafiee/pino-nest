import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEventsService } from './user-events.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('UserGateway');

  constructor(
    private readonly userService: UserService,
    private readonly eventsService: UserEventsService,
  ) {
    // Subscribe to apple balance updates
    this.eventsService.appleBalanceUpdate$.subscribe(({ userId, newBalance }) => {
      this.server.emit('appleBalanceUpdate', { userId, newBalance });
    });
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('increase-apple')
  async handleIncreaseApple(
    client: Socket,
    payload: { gained_apples: number },
  ) {
    try {
      const updatedUser = await this.userService.increaseAppleBalance(payload);
      return { success: true, data: updatedUser };
    } catch (error) {
      this.logger.error('Error handling increase-apple event:', error);
      return { error: error.message };
    }
  }
}