import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { DatabaseModule } from '../../src/database/database.module';

@Module({
  providers: [SeedService],
  imports: [DatabaseModule],
})
export class SeedModule {}
