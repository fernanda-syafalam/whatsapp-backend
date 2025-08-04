import { ApiProperty } from "@nestjs/swagger";
import { createSingleSuccessResponseDto } from "common/dto/api-response.dto";
import { UserPermissionEnum, UserRoleEnum } from "common/enums/user.enum";

export class GetProfileDto {
    @ApiProperty({
        description: 'User ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    userId: string;

    @ApiProperty({
        description: 'User email',
        example: 'user@example.com',
    })
    email: string;

    @ApiProperty({
        description: 'User role',
        example: UserRoleEnum.ADMIN,
        enum: UserRoleEnum,
    })
    role: UserRoleEnum;

    @ApiProperty({
        description: 'User permissions',
        example: [UserPermissionEnum.USER_CREATE, UserPermissionEnum.USER_READ],
        enum: UserPermissionEnum,
        isArray: true,
    })
    permissions: UserPermissionEnum[];

    @ApiProperty({
        description: 'User corporates',
        example: ['1', '2', '3'],
        isArray: true,
    })
    corporates: string[];
}

export const GetProfileResponse = createSingleSuccessResponseDto(
    GetProfileDto,
    'GetProfileResponse',
);

