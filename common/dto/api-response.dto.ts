import { HttpStatus } from "@nestjs/common";

export class ApiResponseDto<T> {
    status: 'success' | 'error';
    code: HttpStatus;
    message: string;
    data?: T;
    errors?: any[];
    pagination?: PaginationMetaDto;
}

export class PaginationMetaDto {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}