import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [BotController],
  providers: [BotService],
  imports: [DatabaseModule],
  exports: [BotService],
})
export class BotModule {}
