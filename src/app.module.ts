import { UserBusinessModule } from './modules/user-business/user-business.module';
import { TapModule } from './modules/tap/tap.module';
import { UserModule } from './modules/user/user.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UserBusinessModule,
    TapModule,
    PrismaModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
