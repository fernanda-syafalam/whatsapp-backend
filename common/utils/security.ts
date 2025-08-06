import { InternalServerErrorException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

export class SecurityUtils {
  private static readonly logger = new Logger(SecurityUtils.name);

  static generateAsymmetricKeys(masterKey: Buffer<ArrayBufferLike>): any {
    const clientKey = crypto.randomBytes(16).toString('hex');
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', masterKey, iv);
    let encryptedPrivateKey = cipher.update(privateKey, 'utf8', 'hex');
    encryptedPrivateKey += cipher.final('hex');

    return {
      clientKey,
      clientPrivateKey: iv.toString('hex') + ':' + encryptedPrivateKey,
      clientPublicKey: publicKey,
    };
  }

  static getPrivateKey(clientPrivateKey: string, masterKey: Buffer): string {
    if (!clientPrivateKey) {
      throw new InternalServerErrorException(
        'Encrypted private key not found.',
      );
    }

    try {
      const [ivHex, encryptedPrivateKeyHex] = clientPrivateKey.split(':');
      if (!ivHex || !encryptedPrivateKeyHex) {
        throw new Error('Invalid encrypted private key format.');
      }

      const iv = Buffer.from(ivHex, 'hex');
      const encryptedPrivateKey = Buffer.from(encryptedPrivateKeyHex, 'hex');

      const decipher = crypto.createDecipheriv('aes-256-cbc', masterKey, iv);

      // Gunakan buffer sebagai input, tidak perlu argumen encoding input.
      // Dapatkan hasil pertama, lalu gabungkan dengan hasil final.
      const decryptedBuffer = Buffer.concat([
        decipher.update(encryptedPrivateKey),
        decipher.final(),
      ]);

      return decryptedBuffer.toString('utf8');
    } catch (error) {
      this.logger.error('Failed to decrypt private key', error.stack);
      throw new InternalServerErrorException('Failed to decrypt private key.');
    }
  }

  public static extractPublicKey(privateKey: string): string {
    if (!privateKey) {
      throw new InternalServerErrorException('Private key is not provided.');
    }

    try {

      const privateKeyObject = crypto.createPrivateKey(privateKey);

      const publicKey = privateKeyObject.export({
        type: 'spki', 
        format: 'pem',
      });

      return publicKey.toString();
    } catch (error) {
      // Tangani error jika private key tidak valid
      throw new InternalServerErrorException(
        'Failed to extract public key from invalid private key.',
        error.message,
      );
    }
  }
}
