import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateBotDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  corporateID: string;

  @IsString()
  description: string;
}
