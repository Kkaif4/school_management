/* eslint-disable @typescript-eslint/restrict-template-expressions */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiProperty } from '@nestjs/swagger';
import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';

export class ErrorResponseDto {
  @ApiProperty({ description: 'Status of the response', example: false })
  success: boolean;

  @ApiProperty({ description: 'Http code of response', example: 400 })
  statusCode: number;

  @ApiProperty({ description: 'Path of endpoint', example: '/api/users' })
  path: string;

  @ApiProperty({ description: 'Error message', example: 'Validation failed' })
  message: string;

  @ApiProperty({
    description: 'Time of response',
    example: '2025-01-20 14:30:45',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Validation errors (if applicable)',
    type: [String],
    required: false,
    example: ['email must be a valid email', 'password is too short'],
  })
  validationErrors?: string[];

  @ApiProperty({
    description: 'Error code for client-side handling',
    required: false,
    example: 'VALIDATION_ERROR',
  })
  errorCode?: string;

  @ApiProperty({
    description: 'Additional error details (only in development)',
    required: false,
  })
  details?: any;
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private readonly isDevelopment = process.env.NODE_ENV === 'development';

  catch(exception: unknown, host: ArgumentsHost): void {
    console.error('Full exception:', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let validationErrors: string[] | undefined;
    let errorCode: string | undefined;
    let details: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      errorCode = this.getHttpExceptionCode(status);

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;

        if (Array.isArray(responseObj.message)) {
          validationErrors = responseObj.message;
          message = 'Validation failed';
          errorCode = 'VALIDATION_ERROR';
        }
      } else {
        message = exception.message;
      }
    } else if (exception instanceof MongoError) {
      const mongoError = this.handleMongoError(exception);
      status = mongoError.status;
      message = mongoError.message;
      errorCode = mongoError.code;

      this.logger.error(
        `MongoDB error ${exception.code}: ${exception.message}`,
        {
          code: exception.code,
          stack: exception.stack,
        },
      );
    } else if (exception instanceof MongooseError.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation failed';
      errorCode = 'MONGOOSE_VALIDATION_ERROR';
      validationErrors = Object.values(exception.errors).map(
        (err) => err.message,
      );

      this.logger.warn(`Mongoose validation error: ${exception.message}`, {
        errors: exception.errors,
      });
    } else if (exception instanceof MongooseError.CastError) {
      status = HttpStatus.BAD_REQUEST;
      message = `Invalid ${exception.kind} for field '${exception.path}'`;
      errorCode = 'MONGOOSE_CAST_ERROR';

      this.logger.warn(`Mongoose cast error: ${exception.message}`, {
        path: exception.path,
        kind: exception.kind,
        value: exception.value,
      });
    } else if (exception instanceof MongooseError.DocumentNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Document not found';
      errorCode = 'DOCUMENT_NOT_FOUND';

      this.logger.warn(`Document not found: ${exception.message}`);
    } else if (exception instanceof MongooseError.VersionError) {
      status = HttpStatus.CONFLICT;
      message =
        'Document version conflict - document was modified by another process';
      errorCode = 'VERSION_CONFLICT';

      this.logger.warn(`Version conflict: ${exception.message}`);
    } else if (exception instanceof Error) {
      // Handle other known Error types
      message = this.isDevelopment
        ? exception.message
        : 'Internal server error';
      errorCode = 'INTERNAL_ERROR';

      this.logger.error(`Unhandled error: ${exception.message}`, {
        name: exception.name,
        stack: exception.stack,
        path: request.url,
      });
    } else {
      // Handle completely unknown errors
      this.logger.error(`Unknown error type: ${exception}`, {
        exception: String(exception),
        path: request.url,
      });
    }

    // Add development details
    if (this.isDevelopment && exception instanceof Error) {
      details = {
        stack: exception.stack,
        name: exception.name,
      };
    }

    const errorResponse: ErrorResponseDto = {
      success: false,
      statusCode: status,
      path: request.url,
      message,
      timestamp: new Date().toISOString(),
      ...(validationErrors && { validationErrors }),
      ...(errorCode && { errorCode }),
      ...(details && { details }),
    };

    // Enhanced logging with request context
    const logContext = {
      statusCode: status,
      path: request.url,
      method: request.method,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
      timestamp: errorResponse.timestamp,
    };

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`Server Error: ${message}`, logContext, details);
    } else if (status >= HttpStatus.BAD_REQUEST) {
      this.logger.warn(`Client Error: ${message}`, logContext, details);
    }

    response.code(status).send(errorResponse);
  }

  private handleMongoError(error: MongoError): {
    status: number;
    message: string;
    code: string;
  } {
    switch (error.code) {
      case 11000:
      case 11001: {
        // Duplicate key error
        const field = this.extractDuplicateField(error.message);
        return {
          status: HttpStatus.CONFLICT,
          message: `Duplicate value for field: ${field}`,
          code: 'DUPLICATE_KEY',
        };
      }
      case 2:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid query or operation',
          code: 'BAD_VALUE',
        };
      case 121:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Document failed validation',
          code: 'DOCUMENT_VALIDATION_FAILURE',
        };
      case 50:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'MongoDB operation exceeded time limit',
          code: 'EXCEEDED_TIME_LIMIT',
        };
      case 13:
        return {
          status: HttpStatus.FORBIDDEN,
          message: 'Unauthorized database operation',
          code: 'UNAUTHORIZED_OPERATION',
        };
      case 18:
        return {
          status: HttpStatus.FORBIDDEN,
          message: 'Authentication failed',
          code: 'AUTH_FAILED',
        };
      case 43:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Cursor not found - query may have timed out',
          code: 'CURSOR_NOT_FOUND',
        };
      case 96:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Operation failed due to user cancellation',
          code: 'OPERATION_FAILED',
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database operation failed',
          code: 'MONGODB_ERROR',
        };
    }
  }

  private extractDuplicateField(errorMessage: string): string {
    // Extract field name from duplicate key error message
    const match = errorMessage.match(/index: (.+?)_\d+/);
    if (match) {
      return match[1];
    }

    // Alternative pattern for different MongoDB versions
    const keyMatch = errorMessage.match(/dup key: { (.+?): /);
    if (keyMatch) {
      return keyMatch[1];
    }

    return 'unknown field';
  }

  private getHttpExceptionCode(status: number): string {
    switch (status as HttpStatus) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'UNPROCESSABLE_ENTITY';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'TOO_MANY_REQUESTS';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'INTERNAL_SERVER_ERROR';
      default:
        return 'HTTP_ERROR';
    }
  }
}
