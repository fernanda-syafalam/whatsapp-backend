import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { DeviceID, GenerateQR, GenerateQRResponse, GetListResponse, Group, SendMessageDto } from './dto/whatsapp';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiHeaders,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { createSingleSuccessResponseDto } from 'common/dto/api-response.dto';
import { SnapAuthGuard } from 'common/guard/snap.guard';
import { AuthGuard } from '@nestjs/passport';
import { CorporateSelect } from 'database/schema/corporate.schema';

@Controller('whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);
  constructor(private readonly whatsappService: WhatsappService) {}

  @ApiOperation({ summary: 'Disconnect' })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @Delete('disconnect/:id')
  async disconnect(@Param() params: DeviceID) {
    await this.whatsappService.disconnect(params.id);
    try {
      return { success: true, code: 200 };
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Generate QR' })
  @ApiOkResponse({
    description: 'The QR code has been successfully generated.',
    type: GenerateQRResponse,
  })
  @Post('generate-qr/:id')
  async generateQr(@Param() params: DeviceID) {
    try {
      const qrCode = await this.whatsappService.generateQr(params.id);
      return { qrCode };
    } catch (error) {
      this.logger.error('Error generating QR code', error.stack);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get devices' })
  @ApiOkResponse({
    description: 'The devices have been successfully retrieved.',
    type: GetListResponse,
  })
  @Get('devices/:id')
  getDevices() {
    const data = this.whatsappService.getDevice();
    return { success: true, code: 200, message: data };
  }


  @ApiOperation({ summary: 'Get groups' })
  @ApiOkResponse({
    description: 'The groups have been successfully retrieved.',
    type: GetListResponse,
  })
  @Get('groups/:id')
  async getGroups(@Param() request: DeviceID) {
    try {
      const groups = await this.whatsappService.getGroups(request.id);
      return { success: true, code: 200, message: groups };
    } catch (error) {
      this.logger.error('Error getting groups', error.stack);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Send message' })
  @ApiHeader({ name: 'X-SIGNATURE', required: true, description: 'Digital signature of the request' })
  @ApiHeader({ name: 'X-TIMESTAMP', required: true, description: 'Request timestamp in ISO 8601 format' })
  @ApiHeader({ name: 'X-CLIENT-KEY', required: true, description: 'The Client Key for authentication' })
  @ApiOkResponse({
    description: 'The message has been successfully sent.',
  })
  @Post('send-message/:id')
  @UseGuards(SnapAuthGuard)
  async sendMessage(@Param() params: DeviceID,@Body() requestBody: SendMessageDto, @Req() req: any) {
    try {
      const client = req.user as CorporateSelect
      const result = await this.whatsappService.sendMessage(client ,params.id, requestBody);
      return { success: true, code: 200, message: result };
    } catch (error) {
      this.logger.error(
        '🚀 ~ WhatsappController ~ sendMessage ~ error:',
        error,
      );
      throw error;
    }
  }
}
