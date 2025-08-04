import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, IsEnum, IsOptional, IsArray } from 'class-validator';

export class PaginationMetaDto {
  @ApiProperty({ description: 'Current page number', example: 1 })
  @IsNumber()
  page: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  @IsNumber()
  limit: number;

  @ApiProperty({
    description: 'Total number of items across all pages',
    example: 100,
  })
  @IsNumber()
  total: number;

  @ApiProperty({ description: 'Total number of pages', example: 10 })
  @IsNumber()
  totalPages: number;
}

class BaseApiResponseDto {
  @ApiProperty({
    description: 'Response status',
    example: 'success',
    enum: ['success', 'error'],
  })
  @IsEnum(['success', 'error'])
  status: 'success' | 'error';

  @ApiProperty({
    description: 'HTTP status code',
    example: HttpStatus.OK,
  })
  @IsNumber()
  code: HttpStatus;

  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  @IsString()
  message: string;
}
// --- Factory Functions with Unique Names ---

export function createSingleSuccessResponseDto<T>(
  dataDto: new () => T,
  schemaName: string, // Unique name for the DTO
): typeof BaseApiResponseDto & { new (): { data: T } } {
  class SingleSuccessResponseDto extends BaseApiResponseDto {
    @ApiProperty({
      description: 'Response data',
      type: () => dataDto,
    })
    data: T;
  }
  Object.defineProperty(SingleSuccessResponseDto, 'name', { value: schemaName });
  return SingleSuccessResponseDto as any;
}

export function createListSuccessResponseDtoWithoutPagination<T>(
  dataDto: new () => T,
  schemaName: string, // Unique name for the DTO
): typeof BaseApiResponseDto & { new (): { data: T[] } } {
  class ListSuccessResponseDto extends BaseApiResponseDto {
    @ApiProperty({
      description: 'Response data',
      type: () => dataDto,
      isArray: true,
    })
    data: T[];
  }
  Object.defineProperty(ListSuccessResponseDto, 'name', { value: schemaName });
  return ListSuccessResponseDto as any;
}

export function createListSuccessResponseDto<T>(
  dataDto: new () => T,
  schemaName: string, // Unique name for the DTO
): typeof BaseApiResponseDto & {
  new (): { data: T[]; pagination: PaginationMetaDto };
} {
  class ListSuccessResponseDto extends BaseApiResponseDto {
    @ApiProperty({
      description: 'Response data',
      type: () => dataDto,
      isArray: true,
    })
    data: T[];

    @ApiProperty({
      description: 'Pagination metadata',
      type: () => PaginationMetaDto,
      example: {
        page: 1,
        limit: 10,
        total: 100,
        totalPages: 10,
      },
    })
    pagination: PaginationMetaDto;
  }
  Object.defineProperty(ListSuccessResponseDto, 'name', { value: schemaName });
  return ListSuccessResponseDto as any;
}

export function createErrorResponseDto(HttpStatus: HttpStatus, message: string, errors: string[], schemaName: string) { 
  class ErrorResponseDto extends BaseApiResponseDto {
    @ApiProperty({
      description: 'Response status',
      example: 'error',
    })
    @IsEnum(['error'])
    status: 'error';

    @ApiProperty({
      description: 'HTTP status code',
      example: HttpStatus,
    })
    @IsNumber()
    code: HttpStatus;

    @ApiProperty({
      description: 'Response message',
      example: message,
    })
    @IsString()
    message: string;

    @ApiPropertyOptional({
      description: 'Response errors',
      type: [String],
      example: errors,
    })
    @IsOptional()
    errors?: string[];
  }
  Object.defineProperty(ErrorResponseDto, 'name', { value: schemaName });
  return ErrorResponseDto;
}

export class ApiResponseDto<T> extends BaseApiResponseDto {
  @ApiProperty({
    description: 'Response data',
  })
  data?: T;
}

export const BadRequestResponse = createErrorResponseDto(
  HttpStatus.BAD_REQUEST,
  'Invalid credentials',
  ['Invalid credentials', 'User not found'],
  'LoginBadRequestDto',
);