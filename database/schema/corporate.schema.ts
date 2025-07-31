import {
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { UserToCorporateSchema } from './user-corporate.schema';
import { relations } from 'drizzle-orm';
import { BotSchema } from './bot.schema';

export const CorporatesSchema = pgTable('corporates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  alias: varchar('alias', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const CorporatesRelations = relations(CorporatesSchema, ({ many }) => ({
  usersToCorporates: many(UserToCorporateSchema),
  botsToCorporates: many(BotSchema),
}));

export type Corporate = typeof CorporatesSchema.$inferSelect;
export type InsertCorporate = typeof CorporatesSchema.$inferInsert;
