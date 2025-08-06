import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [SeedService],
  imports: [DatabaseModule, ConfigModule],
})
export class SeedModule {}
