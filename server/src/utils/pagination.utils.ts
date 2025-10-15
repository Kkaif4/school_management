import {
  PaginatedData,
  PaginationMeta,
} from 'src/common/interfaces/pagination.interface';

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}

export class PaginationUtil {
  /**
   * Creates a paginated response structure
   * @param data - Array of data items
   * @param options - Pagination options
   * @returns PaginatedData with meta information
   */
  static createPaginatedResponse<T>(
    data: T[],
    options: PaginationOptions,
  ): PaginatedData<T> {
    const { page, limit, total } = options;
    const totalPages = Math.ceil(total / limit);

    const meta: PaginationMeta = {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return {
      data,
      meta,
    };
  }

  /**
   * Calculates skip value for database queries
   * @param page - Current page number
   * @param limit - Items per page
   * @returns Skip value for queries
   */
  static calculateSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  /**
   * Validates pagination parameters
   * @param page - Page number
   * @param limit - Items per page
   * @returns Validated and normalized pagination parameters
   */
  static validatePaginationParams(
    page: number = 1,
    limit: number = 10,
  ): {
    page: number;
    limit: number;
  } {
    const validPage = Math.max(1, Math.floor(Number(page)) || 1);
    const validLimit = Math.min(
      100,
      Math.max(1, Math.floor(Number(limit)) || 10),
    );

    return {
      page: validPage,
      limit: validLimit,
    };
  }
}
