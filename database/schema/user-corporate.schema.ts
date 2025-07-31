import { relations } from "drizzle-orm";
import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { CorporatesSchema } from "./corporate.schema";
import { UserSchema } from "./user.schema";

export const UserToCorporateSchema = pgTable(
  'users_to_corporates',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => UserSchema.id, { onDelete: 'cascade' }),
    corporateId: uuid('corporate_id')
      .notNull()
      .references(() => CorporatesSchema.id, { onDelete: 'cascade' }),
    assignedAt: timestamp('assigned_at').defaultNow().notNull(),
  },
);

export const UserToCorporateRelations = relations(UserToCorporateSchema, ({ one }) => ({
  user: one(UserSchema, {
    fields: [UserToCorporateSchema.userId],
    references: [UserSchema.id],
  }),
  corporate: one(CorporatesSchema, {
    fields: [UserToCorporateSchema.corporateId],
    references: [CorporatesSchema.id],
  }),
}));

export type UsersToCorporates = typeof UserToCorporateSchema.$inferSelect;
export type InsertUsersToCorporates = typeof UserToCorporateSchema.$inferInsert;