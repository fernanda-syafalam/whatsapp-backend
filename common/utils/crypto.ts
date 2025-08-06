import * as crypto from 'crypto';
import { InternalServerErrorException } from '@nestjs/common';

export class CryptoUtils {

  /**
   * Generates a new asymmetric key pair and encrypts the private key.
   * @param masterKey The master encryption key.
   * @returns An object containing the encrypted private key and the public key.
   */
  public static createAsymmetricKey(masterKey: Buffer) {
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
      clientPrivateKey: iv.toString('hex') + ':' + encryptedPrivateKey,
      clientPublicKey: publicKey,
    };
  }

  /**
   * Generates a new symmetric key pair (clientKey and clientSecret).
   * @returns An object containing the generated clientKey and clientSecret.
   */
  public static createSymmetricKey() {
    const clientKey = crypto.randomBytes(16).toString('hex');
    return {
      clientKey,
      clientSecret: crypto.createHash('sha256').update(clientKey).digest('hex'),
    };
  }

  /**
   * Verifies a symmetric signature from a request.
   * @param clientSecret The shared secret key.
   * @param request The incoming request object.
   * @param signature The signature from the request header.
   * @param timestamp The timestamp from the request header.
   * @returns boolean indicating whether the signature is valid.
   */
  public static verifySymmetricSignature(
    clientSecret: string,
    request: any,
    signature: string,
    timestamp: string,
  ): boolean {
    try {
      const bodyString = request.body ? JSON.stringify(request.body) : '';
      const hashBody = crypto
        .createHash('sha256')
        .update(bodyString, 'utf8')
        .digest('hex');

      const stringToSign = `${request.method}:${request.url}:${hashBody}:${timestamp}`;

      const calculatedSignature = btoa(
        crypto
          .createHmac('sha512', clientSecret)
          .update(stringToSign, 'utf8')
          .digest('binary'),
      );

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'binary'),
        Buffer.from(calculatedSignature, 'binary'),
      );
    } catch (e) {
      // It's better to log the error here and let the caller handle the exception.
      console.error('Signature verification failed during HMAC calculation.', e);
      return false;
    }
  }
}