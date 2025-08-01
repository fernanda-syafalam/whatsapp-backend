import { Injectable } from '@nestjs/common';
import { CreateCorporateDto } from './dto/create-corporate.dto';
import { UpdateCorporateDto } from './dto/update-corporate.dto';
import { DatabaseService } from 'src/database/database.service';
import { CorporatesSchema } from 'database/schema/corporate.schema';
import { eq, sql } from 'drizzle-orm';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';
import { BotSchema } from 'database/schema/bot.schema';
import { UserToCorporateSchema } from 'database/schema/user-corporate.schema';

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

  async findAll(paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10 } = paginationQuery;
    const data = await this.db
      .select({
        id: CorporatesSchema.id,
        name: CorporatesSchema.name,
        alias: CorporatesSchema.alias,
        totalBots: sql`count(${BotSchema.id})`.as('totalBots'),
        totalUsers: sql`(
          select count(*) 
          from ${UserToCorporateSchema}
          where ${UserToCorporateSchema.corporateId} = ${CorporatesSchema.id}
        )`.as('totalUsers'),
        createdAt: CorporatesSchema.createdAt,
      })
      .from(CorporatesSchema)
      .leftJoin(BotSchema, eq(CorporatesSchema.id, BotSchema.corporateID))
      .limit(limit)
      .offset((page - 1) * limit)
      .groupBy(CorporatesSchema.id);

    const totalItems = await this.db
      .select({ count: sql`count(*)`.mapWith(Number) })
      .from(CorporatesSchema)
      .then((res) => res[0].count);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  getList() {
    return this.db.select().from(CorporatesSchema);
  }

  findOne(id: string) {
    return `This action returns a #${id} corporate`;
  }

  update(id: string, updateCorporateDto: UpdateCorporateDto) {
    return `This action updates a #${id} corporate`;
  }

  remove(id: string) {
    return this.db
      .delete(CorporatesSchema)
      .where(eq(CorporatesSchema.id, id))
  }
}
