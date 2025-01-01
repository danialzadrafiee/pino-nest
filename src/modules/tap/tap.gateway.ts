import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user/user.service';
import { UserEventsService } from '../user/user-events.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class TapGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

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
    Logger.log(`Client connected: ${client.id}`);
    client.emit('connection-success', { message: 'Connected successfully' });
  }

  handleDisconnect(client: Socket) {
    Logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('increase-apple')
  async handleIncreaseApple(
    client: Socket,
    payload: { gained_apples: number },
  ) {
    try {
      const updatedUser = await this.userService.increaseAppleBalance({
        gained_apples: payload.gained_apples,
      });

      client.emit('appleBalanceUpdate', {
        userId: updatedUser.id,
        newBalance: updatedUser.apple_balance,
      });

      return { success: true, data: updatedUser };
    } catch (error) {
      Logger.error('Error increasing apple balance:', error);
      client.emit('error', { message: error.message });
      return { error: error.message };
    }
  }
}
