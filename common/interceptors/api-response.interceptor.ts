import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ApiResponseDto } from 'common/dto/api-response.dto';
import { map, Observable } from 'rxjs';

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();

    return next.handle().pipe(
      map((data) => {
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'pagination' in data
        ) {
          const { data: items, pagination } = data;

          return {
            status: 'success',
            code: response.statusCode,
            message: 'Data retrieved successfully.',
            data: items,
            pagination,
          };
        }

        const message =
          response.statusCode === HttpStatus.CREATED
            ? 'Resource created successfully.'
            : 'Operation successful.';

        return {
          status: 'success',
          code: response.statusCode,
          message: message,
          data: data,
        };
      }),
    );
  }
}
