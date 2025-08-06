import { Injectable } from '@nestjs/common';
import { CreateCorporateDto } from './dto/create-corporate.dto';
import { UpdateCorporateDto } from './dto/update-corporate.dto';
import { DatabaseService } from 'src/database/database.service';
import { CorporatesSchema } from 'database/schema/corporate.schema';
import { eq, sql } from 'drizzle-orm';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';
import { BotSchema } from 'database/schema/bot.schema';
import { UserToCorporateSchema } from 'database/schema/user-corporate.schema';
import { SecurityUtils } from 'common/utils/security';
import { ConfigService } from '@nestjs/config';
import { CryptoUtils } from 'common/utils/crypto';

@Injectable()
export class CorporateService {
  private readonly db = this.databaseService.getConnection();
  private readonly masterKey: Buffer;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {
    const keyString = this.configService.get<string>('MASTER_ENCRYPTION_KEY');
    if (!keyString) {
      throw new Error('MASTER_ENCRYPTION_KEY not defined');
    }
    this.masterKey = Buffer.from(keyString, 'base64');
  }

  async create(createCorporateDto: CreateCorporateDto) {
    const { clientKey, clientSecret } = CryptoUtils.createSymmetricKey();

    const data = {
      ...createCorporateDto,
      clientKey,
      clientSecret,
    };

    return this.db.insert(CorporatesSchema).values(data).returning();
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

  async findOne(id: string) {
    const corporate = await this.db
      .select()
      .from(CorporatesSchema)
      .where(eq(CorporatesSchema.id, id));

    return corporate[0];
  }

  async findByClientKey(clientKey: string) {
    const corporate = await this.db
      .select()
      .from(CorporatesSchema)
      .where(eq(CorporatesSchema.clientKey, clientKey))
      .limit(1);

    return corporate[0];
  }

  update(id: string, updateCorporateDto: UpdateCorporateDto) {
    return `This action updates a #${id} corporate`;
  }

  remove(id: string) {
    return this.db.delete(CorporatesSchema).where(eq(CorporatesSchema.id, id));
  }
}
