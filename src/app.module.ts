import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/users.module';
import { BotModule } from './bot/bot.module';
import { CorporateModule } from './corporate/corporate.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { ConfigModule } from '@nestjs/config';
import { JwtGuard } from 'common/guard/jwt.guard';
import { JwtStrategy } from './auth/strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    BotModule,
    CorporateModule,
    WhatsappModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: JwtGuard, 
    },
    JwtStrategy
  ],
})
export class AppModule {}
