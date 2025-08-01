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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';
import { FindById } from 'common/dto/find-by-id.dto';
import { RolesGuard } from 'common/guard/roles.guard';
import { Roles } from 'common/decorator/roles.decorator';
import { UserRoleEnum } from 'common/enums/user.enum';
import { JwtGuard } from 'common/guard/jwt.guard';

@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.userService.findAll(paginationQuery);
  }

  @Get('/roles')
  async getRoles() {
    const roles = await this.userService.findAllRoles();
    return { items: roles };
  }

  @Get(':id')
  findOne(@Param() params: FindById) {
    return this.userService.findById(params.id);
  }

  @Patch(':id')
  update(@Param('id') params: FindById, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(params.id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') params: FindById) {
    return this.userService.remove(params.id);
  }
}
