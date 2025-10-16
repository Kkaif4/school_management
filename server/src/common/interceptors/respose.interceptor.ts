import {
  Injectable,
  ExecutionContext,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyRequest, FastifyReply } from 'fastify';
import { API_MESSAGE_KEY } from '../decorators/api-response.decorator';
import {
  ApiResponse,
  PaginatedData,
} from 'src/common/interfaces/pagination.interface';

@Injectable()
export class ResponseInterceptor<T = unknown>
  implements NestInterceptor<T, ApiResponse<unknown>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<unknown>> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const response = context.switchToHttp().getResponse<FastifyReply>();

    // Get message from decorator metadata
    const message =
      this.reflector.getAllAndOverride<string>(API_MESSAGE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || 'Success';

    return next.handle().pipe(
      map((data: unknown) => {
        // Handle paginated responses
        if (this.isPaginatedResponse(data)) {
          return {
            success: true,
            statusCode: response.statusCode,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
            data: data.data,
            meta: data.meta,
          };
        }

        // Handle standard responses
        return {
          success: true,
          statusCode: response.statusCode,
          message,
          path: request.url,
          timestamp: new Date().toISOString(),
          data,
        };
      }),
    );
  }

  private isPaginatedResponse(data: unknown): data is PaginatedData<unknown> {
    return (
      data !== null &&
      data !== undefined &&
      typeof data === 'object' &&
      'data' in data &&
      'meta' in data &&
      Array.isArray((data as PaginatedData<unknown>).data)
    );
  }
}
