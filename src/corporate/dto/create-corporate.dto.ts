import { IsNotEmpty, IsString } from "class-validator";

export class CreateCorporateDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsNotEmpty()
    @IsString()
    alias: string;
}
