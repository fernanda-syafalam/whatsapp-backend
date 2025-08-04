import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { CorporateService } from './corporate.service';
import { CreateCorporateDto, CreateCorporateResponseDto, ListCorporateResponseDto, ListCorporateResponseWithoutPaginationDto } from './dto/create-corporate.dto';
import { UpdateCorporateDto } from './dto/update-corporate.dto';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';
import { FindById } from 'common/dto/find-by-id.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  BadRequestResponse,
  createErrorResponseDto,
  createListSuccessResponseDto,
  createListSuccessResponseDtoWithoutPagination,
  createSingleSuccessResponseDto,
} from 'common/dto/api-response.dto';

@Controller('corporates')
export class CorporateController {
  constructor(private readonly corporateService: CorporateService) {}

  @ApiOperation({ summary: 'Create Corporate' })
  @ApiOkResponse({
    description: 'The Corporate has been successfully created.',
    type: CreateCorporateResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: BadRequestResponse,
  })
  @Post()
  create(@Body() createCorporateDto: CreateCorporateDto) {
    return this.corporateService.create(createCorporateDto);
  }

  @ApiOperation({ summary: 'Get all Corporates' })
  @ApiOkResponse({
    description: 'The Corporates have been successfully fetched.',
    type: ListCorporateResponseDto ,
  })
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.corporateService.findAll(paginationQuery);
  }

  @ApiOperation({ summary: 'Get Corporate List' })
  @ApiOkResponse({
    description: 'The Corporates have been successfully fetched.',
    type: ListCorporateResponseWithoutPaginationDto,
  })
  @Get('/list')
  async getCorporateList() {
    return await this.corporateService.getList();
  }

  @ApiOperation({ summary: 'Get Corporate' })
  @ApiOkResponse({
    description: 'The Corporate has been successfully fetched.',
    type: CreateCorporateResponseDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.corporateService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Corporate' })
  @ApiOkResponse({
    description: 'The Corporate has been successfully updated.',
    type:CreateCorporateResponseDto,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCorporateDto: UpdateCorporateDto,
  ) {
    return this.corporateService.update(id, updateCorporateDto);
  }

  @ApiOperation({ summary: 'Delete Corporate' })
  @ApiOkResponse({
    description: 'The Corporate has been successfully deleted.',
  })
  @Delete(':id')
  remove(@Param() params: FindById) {
    return this.corporateService.remove(params.id);
  }
}
