import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class FindById {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-42661417400',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid user ID format' }) 
  id: string;
}