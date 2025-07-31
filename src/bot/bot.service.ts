import { Injectable } from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { DatabaseService } from 'src/database/database.service';
import { BotSchema } from 'database/schema/bot.schema';
import { and, eq, sql } from 'drizzle-orm';
import { CorporatesSchema } from 'database/schema/corporate.schema';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';

@Injectable()
export class BotService {
  private readonly db = this.databaseService.getConnection();
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createBotDto: CreateBotDto) {
    const isExists = await this.db
      .select()
      .from(BotSchema)
      .where(
        and(
          eq(BotSchema.name, createBotDto.name),
          eq(BotSchema.corporateID, createBotDto.corporateID),
        ),
      );

    if (isExists.length > 0) {
      throw new Error('Bot already exists');
    }

    return this.db.insert(BotSchema).values(createBotDto).returning();
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10 } = paginationQuery;
    const offset = (page - 1) * limit;
    const data = await this.db
      .select({
        id: BotSchema.id,
        name: BotSchema.name,
        corporateName: CorporatesSchema.name,
        description: BotSchema.description,
        isActive: BotSchema.isActive,
        createdAt: BotSchema.createdAt,
        updatedAt: BotSchema.updatedAt,
      })
      .from(BotSchema)
      .leftJoin(
        CorporatesSchema,
        eq(BotSchema.corporateID, CorporatesSchema.id),
      )
      .limit(limit)
      .offset(offset);

    const totalItems = await this.db
      .select({ count: sql`count(*)`.mapWith(Number) })
      .from(BotSchema)
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

  findOne(id: string) {
    return this.db.select().from(BotSchema).where(eq(BotSchema.id, id));
  }

  findByDeviceID(id: string) {
    return this.db
      .select()
      .from(BotSchema)
      .where(eq(BotSchema.id, id))
      .limit(1);
  }

  update(id: string, updateBotDto: UpdateBotDto) {
    return this.db
      .update(BotSchema)
      .set(updateBotDto)
      .where(eq(BotSchema.id, id))
      .returning();
  }

  remove(id: string) {
    return this.db.delete(BotSchema).where(eq(BotSchema.id, id));
  }
}
