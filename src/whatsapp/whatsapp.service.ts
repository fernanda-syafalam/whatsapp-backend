import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import makeWASocket, {
  AuthenticationState,
  Browsers,
  ConnectionState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  WAConnectionState,
  WAProto,
} from '@whiskeysockets/baileys';
import * as path from 'path';
import { Boom } from '@hapi/boom';
import * as NodeCache from 'node-cache';
import pino from 'pino';
import { existsSync, rmSync } from 'fs';
import helper from 'common/utils/whatsapp.helper';
import { SendMediaDto, SendMessageDto } from './dto/whatsapp';
import { BotService } from 'src/bot/bot.service';
import * as qrcode from 'qrcode';

export interface DeviceInstance {
  client: ReturnType<typeof makeWASocket> | null;
  initialized: boolean;
  qrCode?: string;
  connection?: WAConnectionState | undefined;
}
const pinoLogger = pino({ level: process.env.LOG_LEVEL || 'error' });

const cacheRetryCounter = new NodeCache({
  stdTTL: 5 * 60,
  useClones: false,
});

@Injectable()
export class WhatsappService {
  private logger = new Logger(WhatsappService.name);
  private devices: Record<string, DeviceInstance> = {};
  constructor(private readonly botService: BotService) {}

  private getAuthFolderPath(deviceID: string): string {
    return path.join(__dirname, `../../../auth/${deviceID}`);
  }

  async disconnect(deviceID: string) {
    try {
      if (!this.devices[deviceID]) {
        throw new Error('Device not found');
      }

      const client = this.devices[deviceID]?.client;

      if (client) {
        try {
          await client.logout();
        } catch (error) {
          this.logger.warn(
            `⚠️ Logout failed for ${deviceID}: ${error.message}`,
          );
        }

        if (client.ws && client.ws.isOpen) {
          client.ws.close();
        }
      }

      delete this.devices[deviceID];

      const authFolderPath = this.getAuthFolderPath(deviceID);

      if (existsSync(authFolderPath)) {
        rmSync(authFolderPath, { recursive: true, force: true });
      }

      return 'success';
    } catch (error) {
      this.logger.error(
        `❌ Error while disconnecting device ${deviceID}:`,
        error,
      );
    }
  }

  private async ensureDeviceInitialized(deviceID: string): Promise<void> {
    while (
      this.devices[deviceID]?.connection === 'connecting' ||
      !this.devices[deviceID]?.initialized
    ) {
      if (this.devices[deviceID]?.qrCode) {
        throw new Error('Need to genereate new QR');
      }
      if (this.devices[deviceID]?.connection === 'close') {
        throw new Error('Need to terminate session');
      }
      await this.initializeDevice(deviceID);
      await helper.delay(500);
    }
  }

  getDevice(): string[] {
    return Object.entries(this.devices).map(([id, device]) => {
      return id;
    });
  }

  async getGroups(deviceID: string) {
    await this.ensureDeviceInitialized(deviceID);
    const groups =
      await this.devices[deviceID]?.client?.groupFetchAllParticipating();

    const result = helper.formatGroups(groups);
    return result;
  }

  async generateQr(deviceID: string): Promise<string> {
    const bot = await this.botService.findOne(deviceID); // Pastikan ini async await
    if (!bot) {
      throw new NotFoundException(
        `Device with ID "${deviceID}" not found. Ensure it has been created.`,
      );
    }

    const MAX_ATTEMPTS = 20; // Maksimal percobaan (misal 20 * 500ms = 10 detik)
    let attempts = 0;

    // Loop untuk menunggu QR code atau sampai batas waktu/kondisi tercapai
    while (attempts < MAX_ATTEMPTS) {
      this.logger.log(
        `Attempt ${attempts + 1} for device ${deviceID}. Current QR state: ${!!this.devices[deviceID]?.qrCode}`,
      );

      // Jika QR code sudah tersedia, keluar dari loop
      if (this.devices[deviceID]?.qrCode) {
        break;
      }

      // Inisialisasi atau re-inisialisasi perangkat
      // Penting: Pastikan initializeDevice mengelola state this.devices[deviceID].qrCode
      await this.initializeDevice(deviceID);

      const currentConnectionStatus = this.devices[deviceID]?.connection;

      // Handle status koneksi yang tidak memungkinkan QR
      if (currentConnectionStatus === 'open') {
        this.logger.warn(
          `Device ${deviceID} is already connected. No QR needed.`,
        );
        throw new BadRequestException(
          'Device is already connected. QR code is not available.',
        );
      }
      if (currentConnectionStatus === 'close') {
        this.logger.error(
          `Device ${deviceID} connection is closed. Session needs to be terminated.`,
        );
        throw new BadRequestException(
          'Device session is closed. Please terminate and re-initialize.',
        );
      }

      attempts++;
      if (attempts < MAX_ATTEMPTS) {
        await helper.delay(500); // Tunggu sebelum mencoba lagi
      } else {
        this.logger.error(
          `Max attempts reached for device ${deviceID}. QR code not generated.`,
        );
        throw new InternalServerErrorException(
          `Failed to generate QR code for device "${deviceID}" after ${MAX_ATTEMPTS} attempts. Please try again.`,
        );
      }
    }

    const qrCodeRawString = qrcode.toDataURL(this.devices[deviceID]?.qrCode);

    if (!qrCodeRawString) {
      this.logger.error(
        `Unexpected: Loop finished, but qrCodeRawString is null for device ${deviceID}.`,
      );
      throw new InternalServerErrorException(
        `An unexpected error occurred: QR code was not available after processing.`,
      );
    }

    return qrCodeRawString;
  }

  private async handleConnectionUpdate(
    deviceID: string,
    update: Partial<ConnectionState>,
  ): Promise<void> {
    const { connection, lastDisconnect, qr } = update;
    this.devices[deviceID];

    if (qr) this.devices[deviceID].qrCode = qr;

    try {
      if (connection === 'close') {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;

        if (shouldReconnect) {
          this.devices[deviceID].initialized = false;
          await this.initializeDevice(deviceID);
        } else {
          this.devices[deviceID].connection = 'close';
          this.devices[deviceID].initialized = false;
          await this.disconnect(deviceID);
          // await this.initializeDevice(deviceID);
        }
      } else if (connection === 'open') {
        this.devices[deviceID].connection = 'open';
        this.devices[deviceID].qrCode = undefined;
      }
    } catch (error) {
      this.logger.error(`Failed to handle connection update: ${error.message}`);
    }
  }

  private async initializeDevice(deviceID: string): Promise<void> {
    if (this.devices[deviceID]?.initialized) return;

    const authFolderPath = this.getAuthFolderPath(deviceID);
    const { state, saveCreds } = await useMultiFileAuthState(authFolderPath);
    const client = await this.setupBaileysSocket(state);

    this.devices[deviceID] = {
      client: client,
      initialized: true,
      connection: 'connecting',
    };

    client.ev.on('creds.update', saveCreds);
    client.ev.on('connection.update', (update) =>
      this.handleConnectionUpdate(deviceID, update),
    );
  }

  private async setupBaileysSocket(state: AuthenticationState) {
    const { version, isLatest } = await fetchLatestBaileysVersion();
    return makeWASocket({
      version,
      logger: pinoLogger,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pinoLogger),
      },
      browser: Browsers.macOS('Chrome'),
      msgRetryCounterCache: cacheRetryCounter,
      markOnlineOnConnect: true,
      fireInitQueries: false,
      shouldSyncHistoryMessage: () => false,
      syncFullHistory: false,
    });
  }

  async sendMessage(id: string ,data: SendMessageDto): Promise<string> {
    const { to, message, disappearingDay = 1 } = data;
    await this.ensureDeviceInitialized(id);

    try {
      const result: WAProto.WebMessageInfo | undefined = await this.devices[
        id
      ].client?.sendMessage(
        to,
        { text: message },
        {
          ephemeralExpiration: disappearingDay * 24 * 60 * 60,
        },
      );

      return 'success';
    } catch (error) {
      throw new Error(`Failed to send message: ${error}`);
    }
  }

  async sendMedia(id: string, data: SendMediaDto): Promise<string> {
    const {
      to: phoneNumber,
      urlMedia,
      ptt,
      mediaType,
      disappearingDay = 0,
    } = data;

    await this.ensureDeviceInitialized(id);
    const client = this.devices[id].client;

    try {
      if (mediaType === 'audio') {
        await client!.sendMessage(
          `${phoneNumber}@s.whatsapp.net`,
          { audio: { url: urlMedia }, ptt, mimetype: 'audio/mpeg' },
          { ephemeralExpiration: disappearingDay * 24 * 60 * 60 },
        );
      }

      return 'success';
    } catch (error) {
      throw new Error(`Failed to send media: ${error.message}`);
    }
  }
}
