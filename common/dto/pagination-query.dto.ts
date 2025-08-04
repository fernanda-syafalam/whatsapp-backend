import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
