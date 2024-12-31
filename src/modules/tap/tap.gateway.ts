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

  handleConnection(_client: Socket) {
  }

  handleDisconnect(_client: Socket) {
  }

  @SubscribeMessage('increase-apple')
  async handleIncreaseApple(
    _client: Socket,
    payload: { gained_apples: number },
  ) {
    try {
      const updatedUser = await this.userService.increaseAppleBalance(payload);
      return { success: true, data: updatedUser };
    } catch (error) {
      return { error: error.message };
    }
  }
}
