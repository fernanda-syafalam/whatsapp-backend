import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserPermissionEnum, UserRoleEnum } from 'common/enums/user.enum';
import { UsersService } from 'src/user/users.service';

export interface JwtPayload {
  userId: string;
  email: string;
  corporates: string[];
  role: UserRoleEnum;
  permissions: UserPermissionEnum[];
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User is inactive or not found.');
    }

    return payload;
  }
}
