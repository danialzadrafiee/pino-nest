import { TapGateway } from './modules/tap/tap.gateway';
import { TapModule } from './modules/tap/tap.module';
import { UserModule } from './modules/user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [TapModule, PrismaModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
