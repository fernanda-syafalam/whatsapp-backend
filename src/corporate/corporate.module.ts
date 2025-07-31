import { Module } from '@nestjs/common';
import { CorporateService } from './corporate.service';
import { CorporateController } from './corporate.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [CorporateController],
  providers: [CorporateService],
  imports: [DatabaseModule],
})
export class CorporateModule {}
