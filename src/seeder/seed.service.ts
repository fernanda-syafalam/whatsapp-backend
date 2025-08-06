import { Injectable, Logger } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { UserPermissionEnum } from '../../common/enums/user.enum';
import { BotSchema } from '../../database/schema/bot.schema';
import { CorporatesSchema } from '../../database/schema/corporate.schema';
import { PermissionsSchema } from '../../database/schema/permission.schema';
import { RoleSchema } from '../../database/schema/role.schema';
import { UserToCorporateSchema } from '../../database/schema/user-corporate.schema';
import { UserPermissionsSchema } from '../../database/schema/user-permission.schema';
import { UserSchema } from '../../database/schema/user.schema';
import { DatabaseService } from '../database/database.service';

type Corporate = { id: string; name: string; alias: string };

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);
  private readonly db = this.databaseService.getConnection();

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  async run() {
    this.logger.log('Starting seed...');

    // 🧹 Step 1: Cleanup
    await this.db.delete(UserToCorporateSchema).execute();
    await this.db.delete(UserPermissionsSchema).execute();
    await this.db.delete(UserSchema).execute();
    await this.db.delete(CorporatesSchema).execute();
    await this.db.delete(RoleSchema).execute();
    await this.db.delete(PermissionsSchema).execute();
    await this.db.delete(BotSchema).execute();

    // 👥 Step 2: Seed roles
    const insertedRoles = await this.db
      .insert(RoleSchema)
      .values([{ name: 'admin' }, { name: 'user' }])
      .returning();

    const adminRole = insertedRoles.find((r) => r.name === 'admin');
    const userRole = insertedRoles.find((r) => r.name === 'user');

    // 🔑 Step 3: Seed permissions
    const permissions = Object.values(UserPermissionEnum).map((permission) => ({
      name: permission,
    }));

    const insertedPermissions = await this.db
      .insert(PermissionsSchema)
      .values(permissions)
      .returning();

    // 🏢 Step 5: Seed corporates
    const corporates = Array.from({ length: 10 }, () =>
      this.genRandomCorporate(),
    );
    const insertedCorporates: Corporate[] = await this.db
      .insert(CorporatesSchema)
      .values(corporates)
      .returning();

    if (!adminRole || !userRole) {
      this.logger.error('Failed to find admin or user role after seeding.');
      throw new Error('Role seeding failed.');
    }

    // 👤 Step 6: Seed admin
    const admin = await this.genRandomUser(adminRole.id);
    admin.email = 'example@example.com';
    const insertedAdmin = await this.db
      .insert(UserSchema)
      .values(admin)
      .returning();

    // 👥 Step 7: Seed users
    const userPromises = Array.from({ length: 10 }, () =>
      this.genRandomUser(userRole.id),
    );
    const users = await Promise.all(userPromises);

    const insertedUsers = await this.db
      .insert(UserSchema)
      .values(users)
      .returning();

    // 🔗 Step 8: Link users to corporates
    const corporateLinks = insertedUsers.map((user) => ({
      userId: user.id,
      corporateId: (faker.helpers.arrayElement(insertedCorporates) as Corporate)
        .id,
    }));

    await this.db.insert(UserToCorporateSchema).values(corporateLinks);

    this.logger.log('Seeding completed successfully.');
  }

  private genRandomCorporate() {
    const { clientKey, clientSecret } = this.createSymetricKey();
    return {
      name: faker.company.name(),
      alias: faker.string.alphanumeric(3).toUpperCase(),
      clientKey,
      clientSecret,
    };
  }

  private async genRandomUser(roleId: string) {
    const password = await bcrypt.hash('password', 10);
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: password,
      role: roleId,
    };
  }

  createSymetricKey() {
    const clientKey = crypto.randomBytes(16).toString('hex');

    return {
      clientKey,
      clientSecret: crypto.createHash('sha256').update(clientKey).digest('hex'),
    };
  }
}
