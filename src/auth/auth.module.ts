import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/user/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import 'dotenv/config';
import { LocalStrategy } from './strategy/local.strategy';
import { SnapStrategy } from './strategy/snap.strategy';
import { CorporateModule } from 'src/corporate/corporate.module';

@Module({
  imports: [
    UsersModule,
    CorporateModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || '',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SnapStrategy],
  exports:[AuthService, PassportModule]
})
export class AuthModule {}
