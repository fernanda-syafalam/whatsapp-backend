import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { User, UserSchema } from 'database/schema/user.schema';
import { eq, sql } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { RoleSchema } from 'database/schema/role.schema';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';
import { CorporatesSchema } from 'database/schema/corporate.schema';
import { UserToCorporateSchema } from 'database/schema/user-corporate.schema';
import { PermissionsSchema } from 'database/schema/permission.schema';
import { UserPermissionsSchema } from 'database/schema/user-permission.schema';

@Injectable()
export class UsersService {
  private readonly saltOrRounds = 10;
  private readonly db = this.databaseService.getConnection();
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: CreateUserDto): Promise<User> {
    const isEmailExists = await this.findByEmail(data.email);
    if (isEmailExists) throw new BadRequestException('Email already exists');

    data.password = await bcrypt.hash(data.password, this.saltOrRounds);
    const user = await this.db.insert(UserSchema).values(data).returning();

    return user[0];
  }

  async findAllRoles() {
    const roles = await this.db.select().from(RoleSchema);
    return roles;
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10 } = paginationQuery;
    const offset = (page - 1) * limit;
    const data = await this.db
      .select({
        id: UserSchema.id,
        name: UserSchema.name,
        email: UserSchema.email,
        role: RoleSchema.name,
        isActive: UserSchema.isActive,
        createdAt: UserSchema.createdAt,
        updatedAt: UserSchema.updatedAt,
      })
      .from(UserSchema)
      .leftJoin(RoleSchema, eq(UserSchema.role, RoleSchema.id))
      .limit(limit)
      .offset(offset);

    const totalItems = await this.db
      .select({ count: sql`count(*)`.mapWith(Number) })
      .from(UserSchema)
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

async findById(id: string) {
  try {
    const user = await this.db
      .select({
        id: UserSchema.id,
        name: UserSchema.name,
        email: UserSchema.email,
        role: RoleSchema.name,
        permissions: sql`array_agg(DISTINCT ${PermissionsSchema.name})`,
        corporates: sql`array_agg(DISTINCT ${CorporatesSchema.name})`,
        isActive: UserSchema.isActive,
        createdAt: UserSchema.createdAt,
        updatedAt: UserSchema.updatedAt,
      })
      .from(UserSchema)
      .leftJoin(RoleSchema, eq(UserSchema.role, RoleSchema.id))
      .leftJoin(UserPermissionsSchema, eq(UserSchema.id, UserPermissionsSchema.user))
      .leftJoin(PermissionsSchema, eq(UserPermissionsSchema.permissionId, PermissionsSchema.id))
      .leftJoin(UserToCorporateSchema, eq(UserSchema.id, UserToCorporateSchema.userId))
      .leftJoin(CorporatesSchema, eq(UserToCorporateSchema.corporateId, CorporatesSchema.id))
      .where(eq(UserSchema.id, id))
      .groupBy(UserSchema.id, RoleSchema.name) // ⬅️ Tambahkan ini
      .limit(1);

    if (user.length === 0) return null;

    return user[0];
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw new BadRequestException('An error occurred while fetching the user');
  }
}


  async findByEmail(email: string) {
    const user = await this.db
      .select()
      .from(UserSchema)
      .where(eq(UserSchema.email, email));

    return user[0];
  }

  async remove(id: string) {
    await this.db.delete(UserSchema).where(eq(UserSchema.id, id));
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const [user] = await this.db
      .update(UserSchema)
      .set(updateUserDto)
      .where(eq(UserSchema.id, id))
      .returning();

    return user;
  }
}
