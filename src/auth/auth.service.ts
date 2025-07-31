import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/user/users.service';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from 'database/schema/user.schema';
import { JwtPayload } from './strategy/jwt.strategy';
import { UserPermissionEnum, UserRoleEnum } from 'common/enums/user.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async login(req: User) {
    const user = await this.usersService.findById(req.id);
    if (!user || !user.isActive) {
      throw new BadRequestException('User not found or inactive');
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRoleEnum,
      permissions: user.permissions as UserPermissionEnum[],
      corporates: user.corporates as string[],
    };
    console.log('AuthService - Login payload:', payload);
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('User or password is not valid');

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch)
      throw new BadRequestException('User or password is not valid');

    return user;
  }
}
