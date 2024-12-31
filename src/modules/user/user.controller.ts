import { Body, Controller, Logger, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('increase-apple')
  increaseAppleBalance(@Body() body: { gained_apples: number }) {
    const { gained_apples } = body;
    return this.userService.increaseAppleBalance({ gained_apples });
  }
}
