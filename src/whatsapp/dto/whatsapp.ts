import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { createSingleSuccessResponseDto } from 'common/dto/api-response.dto';

export class DeviceID {
  @ApiProperty({
    description: 'Device ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  id: string;
}

export class GetDevicesResponse {
  success: boolean;
  code: number;
  message: string[];
}

export class GetGroupsResponse {
  success: boolean;
  code: number;
  message: Group[];
}

export class Group {
  @ApiProperty({
    description: 'Group ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Group name',
    example: 'John Doe',
  })
  subject: string;

  @ApiProperty({
    description: 'Group owner',
    example: 'John Doe',
  })
  subjectOwner?: string;

  @ApiProperty({
    description: 'Group creation time',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  subjectTime?: number;

  @ApiProperty({
    description: 'Group creation time',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  size?: number;
}

export class SendMessageDto {
  @ApiProperty({
    description: 'To',
    example: '6289917721000@c.us',
  })
  @IsString()
  to: string;
  
  @ApiProperty({
    description: 'Message',
    example: 'Hello, world!',
  })
  @IsString()
  message: string;
  
  @ApiProperty({
    description: 'Disappearing day',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  disappearingDay?: number;
}

export class SendMediaDto {
  to: string;
  urlMedia: string;
  mediaName: string;
  ptt: boolean;
  mediaType: string;
  disappearingDay?: number;
}

export class DefaultResponse {
  success: boolean;
  code: number;
  message?: string;
  error?: string;
}

export class GenerateQR {
  @ApiProperty({
    description: 'QR code',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  qrCode: string;
}


export const GenerateQRResponse = createSingleSuccessResponseDto(
  GenerateQR,
  'GenerateQRResponse',
);

export const GetListResponse = createSingleSuccessResponseDto(
  GetDevicesResponse,
  'GetListResponse',
);