import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { createListSuccessResponseDto, createSingleSuccessResponseDto } from 'common/dto/api-response.dto';

export class CreateBotDto {
  @ApiProperty({
    description: 'The name of the bot',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The corporate ID of the bot',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  corporateID: string;

  @ApiPropertyOptional({
    description: 'The description of the bot',
    example: 'John Doe',
  })
  @IsString()
  description: string;
}

export const CreateBotResponseDto  = createSingleSuccessResponseDto(CreateBotDto, 'CreateBotResponseDto');

export const ListBotResponseDto = createListSuccessResponseDto(CreateBotDto, 'ListBotResponseDto');