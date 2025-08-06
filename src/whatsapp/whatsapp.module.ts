import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { BotModule } from 'src/bot/bot.module';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [BotModule, AuthModule, DatabaseModule],
  controllers: [WhatsappController],
  providers: [
    WhatsappService,
  ],
})
export class WhatsappModule {}
