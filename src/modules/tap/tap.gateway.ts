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
import { RateLimiterMemory } from 'rate-limiter-flexible';

@WebSocketGateway()
export class TapGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private rateLimiter: RateLimiterMemory;

  constructor(
    private readonly userService: UserService,
    private readonly eventsService: UserEventsService,
  ) {
    // Allow 200 taps per second
    this.rateLimiter = new RateLimiterMemory({
      points: 200,
      duration: 1,
    });

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
      // Check rate limit
      await this.rateLimiter.consume(client.id);

      const updatedUser = await this.userService.increaseAppleBalance({
        gained_apples: payload.gained_apples,
        source: 'tap'
      });

      // No need to emit here as UserService already emits through UserEventsService
      return { success: true, data: updatedUser };
    } catch (error) {
      if (error.remainingPoints !== undefined) {
        // Rate limit error
        client.emit('error', { message: 'Tapping too fast! Please slow down.' });
        return { error: 'Rate limit exceeded' };
      }
      
      Logger.error('Error increasing apple balance:', error);
      client.emit('error', { message: error.message });
      return { error: error.message };
    }
  }
}
