import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { createSingleSuccessResponseDto } from 'common/dto/api-response.dto';

export class LoginDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'K9A4o@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'StrongPassword123!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginResponseBody {
  @ApiProperty({
    description: 'JWT access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxw5eQ2c9z8f4y5Z5a55a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5',
  })
  accessToken: string;
}

export const LoginResponseDto = createSingleSuccessResponseDto(
  LoginResponseBody,
  'LoginResponseDto',
)