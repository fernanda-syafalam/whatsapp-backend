import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'common/decorator/public.decorator';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import {
  BadRequestResponse,
  createErrorResponseDto,
  createSingleSuccessResponseDto,
} from 'common/dto/api-response.dto';
import { GetProfileDto, GetProfileResponse } from './dto/get-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user and return JWT token',
  })
  @ApiBody({
    description: 'User login credentials',
    type: LoginDto,
  })
  @ApiOkResponse({
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid credentials',
    type: BadRequestResponse,
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req) {
    try {
      return this.authService.login(req.user);
    } catch (error) {
      throw error;
    }
  }

  @ApiProperty({
    description: 'Get user profile',
  })
  @ApiOkResponse({
    description: 'User profile',
    type: GetProfileResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid credentials',
    type: BadRequestResponse,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    try {
      return req.user;
    } catch (error) {
      throw error;
    }
  }
}
