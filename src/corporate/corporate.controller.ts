import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CorporateService } from './corporate.service';
import { CreateCorporateDto } from './dto/create-corporate.dto';
import { UpdateCorporateDto } from './dto/update-corporate.dto';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';
import { FindById } from 'common/dto/find-by-id.dto';

@Controller('corporates')
export class CorporateController {
  constructor(private readonly corporateService: CorporateService) {}

  @Post()
  create(@Body() createCorporateDto: CreateCorporateDto) {
    return this.corporateService.create(createCorporateDto);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.corporateService.findAll(paginationQuery);
  }

  @Get('/list')
  async getCorporateList() {
    return await this.corporateService.getList();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.corporateService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCorporateDto: UpdateCorporateDto,
  ) {
    return this.corporateService.update(id, updateCorporateDto);
  }

  @Delete(':id')
  remove(@Param() params:FindById) {
    return this.corporateService.remove(params.id);
  }
}
