import { Injectable, Logger } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import 'dotenv/config';

@Injectable()
export class DatabaseService {
  private readonly pool: Pool;
  private readonly db: ReturnType<typeof drizzle>;
  private readonly logger = new Logger('DatabaseService');

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this.db = drizzle(this.pool, {
      logger: true,
    });

    this.pool
      .connect()
      .then(() => {
        this.logger.verbose('✅ Database connected successfully');
      })
      .catch((error) => {
        this.logger.error('❌ Database connection error:', error);
      });
  }

  getConnection() {
    return this.db;
  }
}
