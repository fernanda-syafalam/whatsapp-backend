import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/user/users.service';
import * as crypto from 'crypto';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from 'database/schema/user.schema';
import { JwtPayload } from './strategy/jwt.strategy';
import { UserPermissionEnum, UserRoleEnum } from 'common/enums/user.enum';
import { ConfigService } from '@nestjs/config';
import { CryptoUtils } from 'common/utils/crypto';
import { CorporateService } from 'src/corporate/corporate.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly corporateService: CorporateService,
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

  private extractAndValidateHeaders(request: any) {
    const signature = request.headers['x-signature'] as string;
    const timestamp = request.headers['x-timestamp'] as string;
    const clientKey = request.headers['x-client-key'] as string;

    if (!signature || !timestamp || !clientKey) {
      throw new UnauthorizedException(
        'Missing one or more required SNAP headers: X-SIGNATURE, X-TIMESTAMP, or X-CLIENT-KEY.',
      );
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const receivedTimestampInSeconds = parseInt(timestamp, 10);
    const maxAgeInSeconds = this.configService.get<number>('snap.maxAge', 300);

    if (Math.abs(nowInSeconds - receivedTimestampInSeconds) > maxAgeInSeconds) {
      throw new UnauthorizedException(
        'Request has expired or timestamp is invalid.',
      );
    }

    return { signature, timestamp, clientKey };
  }

  /**
   * Validates a symmetric signature from a request using a client secret.
   * @param request The incoming request object.
   * @returns An object containing the validated client, or throws an exception.
   */
  public async validateSymmetricRequest(request: any): Promise<any> {
    const { signature, timestamp, clientKey } =
      this.extractAndValidateHeaders(request);

    const client = await this.corporateService.findByClientKey(clientKey);
    if (!client) {
      throw new UnauthorizedException('SNAP client secret is not configured.');
    }

    const isVerified = CryptoUtils.verifySymmetricSignature(
      client.clientSecret,
      request,
      signature,
      timestamp,
    );

    if (!isVerified) {
      this.logger.warn(`Invalid SNAP signature for client key: ${clientKey}`);
      throw new UnauthorizedException('Invalid signature.');
    }

    this.logger.log(`SNAP request validated for client key: ${clientKey}`);
    return { client };
  }
}
