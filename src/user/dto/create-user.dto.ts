import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { createSingleSuccessResponseDto, createListSuccessResponseDto, createListSuccessResponseDtoWithoutPagination } from 'common/dto/api-response.dto';

type Role = 'admin' | 'user';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'K9A4o@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'StrongPassword123!',
  })
  @IsNotEmpty()
  @IsString()
  // @Matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{12,20}$/,
  //   {
  //     message:
  //       'Password must be at least 8 characters, contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
  //   },
  // )
  password: string;
}

export const CreateUserResponseDto = createSingleSuccessResponseDto(
  CreateUserDto,
  'CreateUserResponseDto',
);

export const ListUserResponseDto = createListSuccessResponseDto(
  CreateUserDto,
  'ListUserResponseDto',
);

export const ListUserResponseWithoutPaginationDto = createListSuccessResponseDtoWithoutPagination(
  CreateUserDto,
  'ListUserResponseWithoutPaginationDto',
);

