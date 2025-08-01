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
import { BotService } from './bot.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';

@Controller('bots')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post()
  create(@Body() createBotDto: CreateBotDto) {
    return this.botService.create(createBotDto);
  }

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return await this.botService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBotDto: UpdateBotDto) {
    return this.botService.update(id, updateBotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.botService.remove(id);
  }
}
