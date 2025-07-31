import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { UserToCorporateSchema } from './user-corporate.schema';
import { RoleSchema } from './role.schema';
import { UserPermissionsSchema } from './user-permission.schema';

export const UserSchema = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  role: uuid('role')
    .notNull()
    .references(() => RoleSchema.id, { onDelete: 'cascade' }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const usersRelations = relations(UserSchema, ({ many, one }) => ({
  usersToCorporates: many(UserToCorporateSchema),
  userToRoles: one(RoleSchema, {
    fields: [UserSchema.role],
    references: [RoleSchema.id],
  }),
  userToPermissions: many(UserPermissionsSchema),
}));

export type User = typeof UserSchema.$inferSelect;
export type InsertUser = typeof UserSchema.$inferInsert;
