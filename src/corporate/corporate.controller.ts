import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CorporateService } from './corporate.service';
import { CreateCorporateDto } from './dto/create-corporate.dto';
import { UpdateCorporateDto } from './dto/update-corporate.dto';

@Controller('corporate')
export class CorporateController {
  constructor(private readonly corporateService: CorporateService) {}

  @Post()
  create(@Body() createCorporateDto: CreateCorporateDto) {
    return this.corporateService.create(createCorporateDto);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.corporateService.findAll(page, limit);
  }

  @Get('/list')
  async getCorporateList() {
    const data = await this.corporateService.getList();
    return {
      success: true,
      code: 200,
      items: data,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.corporateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCorporateDto: UpdateCorporateDto) {
    return this.corporateService.update(+id, updateCorporateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.corporateService.remove(+id);
  }
}
