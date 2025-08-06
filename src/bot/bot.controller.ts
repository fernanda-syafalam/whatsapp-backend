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
import { BotService } from './bot.service';
import {
  CreateBotDto,
  CreateBotResponseDto,
  ListBotResponseDto,
} from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { PaginationQueryDto } from 'common/dto/pagination-query.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';
import {
  createErrorResponseDto,
} from 'common/dto/api-response.dto';

@Controller('bots')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @ApiOperation({ summary: 'Create a new bot' })
  @ApiOkResponse({
    description: 'The bot has been successfully created.',
    type: CreateBotResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: createErrorResponseDto(
      HttpStatus.BAD_REQUEST,
      'Bad Request',
      [],
      'CreateBotBadRequestDto',
    ),
  })
  @Post()
  create(@Body() createBotDto: CreateBotDto) {
    return this.botService.create(createBotDto);
  }

  @ApiOperation({ summary: 'Get all bots' })
  @ApiOkResponse({
    description: 'The bots have been successfully retrieved.',
    type: ListBotResponseDto,
  })
  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return await this.botService.findAll(paginationQuery);
  }

  @ApiOperation({ summary: 'Get one bot' })
  @ApiOkResponse({
    description: 'The bot has been successfully retrieved.',
    type: CreateBotResponseDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botService.findOne(id);
  }

  @ApiOperation({ summary: 'Update bot by id' })
  @ApiOkResponse({
    description: 'The bot has been successfully updated.',
    type: CreateBotResponseDto,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBotDto: UpdateBotDto) {
    return this.botService.update(id, updateBotDto);
  }

  @ApiOperation({ summary: 'Delete bot by id' })
  @ApiOkResponse({
    description: 'The bot has been successfully deleted.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.botService.remove(id);
  }
}
