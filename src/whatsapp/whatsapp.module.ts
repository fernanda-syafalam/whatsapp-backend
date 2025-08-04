import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { BotModule } from 'src/bot/bot.module';
import { SnapAuthGuard } from 'common/guard/snap.guard';
import { SnapStrategy } from 'src/auth/strategy/snap.strategy';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [BotModule, AuthModule],
  controllers: [WhatsappController],
  providers: [
    WhatsappService,
  ],
})
export class WhatsappModule {}
