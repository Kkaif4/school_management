import { Injectable } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import {
  PaginatedData,
  PaginationMeta,
} from '../common/interfaces/pagination.interface';
@Injectable()
export class ResponseTransformService {
  /**
   * Transforms a plain object or Mongoose document to a DTO
   * @param dto - The DTO class constructor
   * @param data - The plain object or document to transform
   * @returns Transformed DTO instance
   */
  transform<T, V>(dto: ClassConstructor<T>, data: V): T {
    return plainToInstance(dto, data, {
      excludeExtraneousValues: true, // Only include @Expose() decorated properties
      enableImplicitConversion: true, // Auto-convert types
      exposeDefaultValues: true,
    });
  }

  /**
   * Transforms an array of plain objects or Mongoose documents to DTOs
   * @param dto - The DTO class constructor
   * @param data - Array of plain objects or documents to transform
   * @returns Array of transformed DTO instances
   */
  transformArray<T, V>(dto: ClassConstructor<T>, data: V[]): T[] {
    return plainToInstance(dto, data, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
      exposeDefaultValues: true,
    });
  }

  /**
   * Creates a paginated response with transformed DTOs
   * @param dto - The DTO class constructor
   * @param data - Array of plain objects or documents to transform
   * @param meta - Pagination metadata
   * @returns Paginated response with transformed data
   */
  transformPaginatedResponse<T, V>(
    dto: ClassConstructor<T>,
    data: V[],
    meta: PaginationMeta,
  ): PaginatedData<T> {
    return {
      data: this.transformArray(dto, data),
      meta,
    };
  }

  /**
   * Conditionally transforms data if it exists
   * @param dto - The DTO class constructor
   * @param data - The data to transform (can be null/undefined)
   * @returns Transformed DTO instance or null
   */
  transformOptional<T, V>(dto: ClassConstructor<T>, data?: V | null): T | null {
    if (!data) return null;
    return this.transform(dto, data);
  }
}
