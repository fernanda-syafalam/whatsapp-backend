import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class FindById {
  @IsString()
  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid user ID format' }) 
  id: string;
}