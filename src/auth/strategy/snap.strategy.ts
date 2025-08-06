import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// import { Request } from 'express'; // Import Request type
import { Strategy } from 'passport-custom'; // <-- Change this line
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { CryptoUtils } from 'common/utils/crypto';

@Injectable()
export class SnapStrategy extends PassportStrategy(Strategy, 'snap') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async validate(request: Request) {
    try {
      const client = await this.authService.validateSymmetricRequest(request);
      return client;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
