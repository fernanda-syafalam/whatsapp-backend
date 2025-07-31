import { Body, Controller, Logger, Post } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { DeviceID, SendMessageDto } from './dto/whatsapp';

@Controller('whatsapp')
export class WhatsappController  {
  private readonly logger = new Logger(WhatsappController.name);
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('disconnect')
  async disconnect(@Body() request: DeviceID) {
    try {
      await this.whatsappService.disconnect(request.deviceID);
      return { success: true, code: 200 };
    } catch (error) {
      throw error;
    }
  }

  @Post('generate-qr')
  async generateQr(@Body() request: DeviceID) {
    try {
      const qrCode = await this.whatsappService.generateQr(request.deviceID);

      return { qrCode };
    } catch (error) {
      this.logger.error('Error generating QR code', error.stack);
      throw error;
    }
  }

  getDevices() {
    const data = this.whatsappService.getDevice();
    return { success: true, code: 200, message: data };
  }

  async getGroups(request: DeviceID) {
    try {
      const groups = await this.whatsappService.getGroups(request.deviceID);
      return { success: true, code: 200, message: groups };
    } catch (error) {
      this.logger.error('Error getting groups', error.stack);
      throw error;
    }
  }

  async sendMessage(request: SendMessageDto) {
    try {
      const result = await this.whatsappService.sendMessage(request);
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
