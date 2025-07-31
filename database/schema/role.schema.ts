import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { UserSchema } from './user.schema';

export const RoleSchema = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const RoleRelations = relations(RoleSchema, ({ many }) => ({
  usersToRoles: many(UserSchema),
}));

export type RoleSelect = typeof RoleSchema.$inferSelect;
export type RoleInsert = typeof RoleSchema.$inferInsert;
