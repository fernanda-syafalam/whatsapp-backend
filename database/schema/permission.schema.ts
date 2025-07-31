import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { UserPermissionsSchema } from './user-permission.schema';

export const PermissionsSchema = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const permissionsRelations = relations(
  PermissionsSchema,
  ({ many }) => ({
    rolePermissions: many(UserPermissionsSchema),
  }),
);
