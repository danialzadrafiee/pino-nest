import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserEventsService } from '../user/user-events.service';

@WebSocketGateway()
export class TapGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('TapGateway');

  constructor(
    private readonly userService: UserService,
    private readonly eventsService: UserEventsService,
  ) {
    this.eventsService.appleBalanceUpdate$.subscribe(
      ({ userId, newBalance }) => {
        this.server.emit('appleBalanceUpdate', { userId, newBalance });
      },
    );
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
