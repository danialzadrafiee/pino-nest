import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('user')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get()
  getAuthUser() {
    return this.authService.getAuthUser();
  }
}
