import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SnapAuthGuard extends AuthGuard('snap-auth') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('SnapAuthGuard is active, checking for authentication...');

    return super.canActivate(context);
  }
}