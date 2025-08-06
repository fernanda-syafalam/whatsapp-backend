import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  createListSuccessResponseDto,
  createListSuccessResponseDtoWithoutPagination,
  createSingleSuccessResponseDto,
} from 'common/dto/api-response.dto';

export class CreateCorporateDto {
  @ApiProperty({
    description: 'The name of the corporate',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The alias of the corporate',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  alias: string;
}

export const CreateCorporateResponseDto = createSingleSuccessResponseDto(
  CreateCorporateDto,
  'CreateCorporateResponseDto',
);

export const ListCorporateResponseDto = createListSuccessResponseDto(
  CreateCorporateDto,
  'ListCorporateResponseDto',
);

export const ListCorporateResponseWithoutPaginationDto =
  createListSuccessResponseDtoWithoutPagination(
    CreateCorporateDto,
    'ListCorporateResponseWithoutPaginationDto',
  );
