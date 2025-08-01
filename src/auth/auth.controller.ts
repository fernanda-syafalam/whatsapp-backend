import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'common/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req) {
    try {
      return this.authService.login(req.user);
    } catch (error) {
      throw error;
    }
  }

  @Get('profile')
  getProfile(@Request() req) {
    try {
      return req.user;
    } catch (error) {
      throw error;
    }
  }
}
