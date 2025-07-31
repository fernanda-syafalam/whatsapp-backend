import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { RoleSchema } from './role.schema';
import { PermissionsSchema } from './permission.schema';
import { UserSchema } from './user.schema';

export const UserPermissionsSchema = pgTable('role_permissions', {
  user: uuid('user')
    .notNull()
    .references(() => UserSchema.id, { onDelete: 'cascade' }),
  permissionId: uuid('permission_id')
    .notNull()
    .references(() => PermissionsSchema.id),
});

export const rolePermissionsRelations = relations(
  UserPermissionsSchema,
  ({ one }) => ({
    user: one(UserSchema, {
      fields: [UserPermissionsSchema.user],
      references: [UserSchema.id],
    }),
    permission: one(PermissionsSchema, {
      fields: [UserPermissionsSchema.permissionId],
      references: [PermissionsSchema.id],
    }),
  }),
);
