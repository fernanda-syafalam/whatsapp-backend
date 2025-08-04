import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class SnapStrategy extends PassportStrategy(Strategy, 'snap-auth') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(request: Request) {
    const signature = request.headers['x-signature'] as string;
    const timestamp = request.headers['x-timestamp'] as string;
    const clientKey = request.headers['x-client-key'] as string;

    if (!signature || !timestamp || !clientKey) {
      throw new UnauthorizedException('Missing required headers');
    }

    const isValid = this.authService.validateSignature(
      signature,
      timestamp,
      clientKey,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid signature');
    }
    return { clientKey };
  }
}
