import { SetMetadata } from '@nestjs/common';
import { UserPermissionEnum } from 'common/enums/user.enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: UserPermissionEnum[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);