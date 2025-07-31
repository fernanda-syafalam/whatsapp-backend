import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from 'common/decorator/permission.decorator';
import { UserPermissionEnum } from 'common/enums/user.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Ambil izin yang dibutuhkan dari metadata route
    const requiredPermissions = this.reflector.getAllAndOverride<
      UserPermissionEnum[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions) {
      // Jika tidak ada izin yang ditentukan, izinkan akses
      return true;
    }

    // Dapatkan request object dan user dari context
    const { user } = context.switchToHttp().getRequest();

    // Pastikan user dan user.permissions ada
    if (!user || !user.permissions || !Array.isArray(user.permissions)) {
      return false; // Pengguna tidak memiliki izin atau formatnya salah
    }

    // Periksa apakah pengguna memiliki semua izin yang dibutuhkan
    // Menggunakan 'every' jika semua izin harus dipenuhi
    // Menggunakan 'some' jika setidaknya satu izin harus dipenuhi
    return requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );
  }
}
