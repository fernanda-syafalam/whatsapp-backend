import { HttpException, HttpStatus } from '@nestjs/common';
import { ResponseCode, ResponseMessage } from '../enums/response.enum';

export class ValidationException extends HttpException {
  constructor(validationErrors: any[]) {
    super(
      {
        responseCode: ResponseCode.MISSING_MANDATORY_FIELD,
        message: ResponseMessage[ResponseCode.MISSING_MANDATORY_FIELD],
        details: validationErrors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
