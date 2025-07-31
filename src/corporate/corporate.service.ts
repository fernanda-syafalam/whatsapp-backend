import { Injectable } from '@nestjs/common';
import { CreateCorporateDto } from './dto/create-corporate.dto';
import { UpdateCorporateDto } from './dto/update-corporate.dto';
import { DatabaseService } from 'src/database/database.service';
import { CorporatesSchema } from 'database/schema/corporate.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class CorporateService {
  private readonly db = this.databaseService.getConnection();
  constructor(private readonly databaseService: DatabaseService) {}

  create(createCorporateDto: CreateCorporateDto) {
    return this.db
      .insert(CorporatesSchema)
      .values(createCorporateDto)
      .returning();
  }

  findAll(page = 1, limit = 10) {
    return this.db
      .select()
      .from(CorporatesSchema)
      .limit(limit)
      .offset((page - 1) * limit);
  }


  getList(){
    return this.db.select().from(CorporatesSchema);
  }

  findOne(id: number) {
    return `This action returns a #${id} corporate`;
  }

  update(id: number, updateCorporateDto: UpdateCorporateDto) {
    return `This action updates a #${id} corporate`;
  }

  remove(id: number) {
    return `This action removes a #${id} corporate`;
  }
}
