import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserResponseDto, ListUserResponseDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';
import { FindById } from 'common/dto/find-by-id.dto';
import { RolesGuard } from 'common/guard/roles.guard';
import { Roles } from 'common/decorator/roles.decorator';
import { UserRoleEnum } from 'common/enums/user.enum';
import { JwtGuard } from 'common/guard/jwt.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  BadRequestResponse,
  createErrorResponseDto,
  createListSuccessResponseDto,
  createListSuccessResponseDtoWithoutPagination,
  createSingleSuccessResponseDto,
} from 'common/dto/api-response.dto';
import { ListResponseDto, ListResponseDtoSchema } from 'common/dto/list-response.dto';
import { CreateBotResponseDto } from 'src/bot/dto/create-bot.dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: CreateBotResponseDto,

  })
  @ApiBadRequestResponse({
    description: 'Bad Request. The input data is not valid.',
    type: BadRequestResponse
  })
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'The users have been successfully retrieved.',
    type: ListUserResponseDto,
  })
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.userService.findAll(paginationQuery);
  }



  @ApiOperation({ summary: 'Get all roles' })
  @ApiOkResponse({
    description: 'The roles have been successfully retrieved.',
    type: ListResponseDtoSchema,
  })
  @Get('/roles')
  async getRoles() {
    const roles = await this.userService.findAllRoles();
    return { items: roles };
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({
    description: 'The user has been successfully retrieved.',
    type: CreateUserResponseDto,
  })
  @Get(':id')
  findOne(@Param() params: FindById) {
    return this.userService.findById(params.id);
  }

  @ApiOperation({ summary: 'Update user by id' })
  @ApiOkResponse({
    description: 'The user has been successfully updated.',
    type: CreateUserResponseDto,
  })
  @Patch(':id')
  update(@Param('id') params: FindById, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(params.id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user by id' })
  @ApiOkResponse({
    description: 'The user has been successfully deleted.',
  })
  @Delete(':id')
  remove(@Param('id') params: FindById) {
    return this.userService.remove(params.id);
  }
}
