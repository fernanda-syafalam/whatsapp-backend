import { ApiProperty } from "@nestjs/swagger";
import {  createListSuccessResponseDtoWithoutPagination } from "./api-response.dto";

export class ListResponseDto {
    @ApiProperty({ description: 'ID', example: '123e4567-e89b-12d3-a456-426614174000' })
    id: string;

    @ApiProperty({ description: 'Name', example: 'John Doe' })
    name: string;
}

export const ListResponseDtoSchema = createListSuccessResponseDtoWithoutPagination(ListResponseDto, 'ListResponseDtoSchema');