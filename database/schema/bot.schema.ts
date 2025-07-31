import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { CorporatesSchema } from './corporate.schema';

export const BotSchema = pgTable('bots', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  description: varchar('description', { length: 150 }).notNull(),
  corporateID: uuid('corporate_id')
    .notNull()
    .references(() => CorporatesSchema.id, { onDelete: 'cascade' }),
  isActive: boolean('is_active').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const BotRelations = relations(BotSchema, ({ one }) => ({
  botsToCorporates: one(CorporatesSchema),
}));

export type BotSelect = typeof BotSchema.$inferSelect;
export type BotInsert = typeof BotSchema.$inferInsert;
