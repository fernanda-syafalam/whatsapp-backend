import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'common/decorator/roles.decorator';
import { UserRoleEnum } from 'common/enums/user.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Ambil peran yang dibutuhkan dari metadata route
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      // Jika tidak ada peran yang ditentukan, izinkan akses
      return true;
    }
    // Dapatkan request object dan user dari context
    const { user } = context.switchToHttp().getRequest();

    // Pastikan user dan user.role ada
    if (!user || !user.role) return false; 

    return requiredRoles.includes(user.role);
  }
}
