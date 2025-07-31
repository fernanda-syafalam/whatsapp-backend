import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ResponseCode, ResponseMessage } from '../enums/response.enum';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      typeof exception.getStatus === 'function' ? exception.getStatus() : 500;

    const exceptionResponse =
      typeof exception.getResponse === 'function'
        ? exception.getResponse()
        : {
            responseCode: ResponseCode.INTERNAL_SERVER_ERROR,
            message:
              exception.message ||
              ResponseMessage[ResponseCode.INTERNAL_SERVER_ERROR],
            details: exception.stack || null,
          };

    response.statusCode = status;
    response.send({
      status: false,
      responseCode: exceptionResponse.responseCode,
      message: exceptionResponse.message || 'An unexpected error occurred.',
      details: exceptionResponse.details || null,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
