export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  path: string;
  timestamp: string;
  data?: T;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages?: number;
}

export interface PaginatedData<T = unknown> {
  data: T[];
  meta: PaginationMeta;
}

// Helper type for controllers
export type ControllerResponse<T = unknown> = T | PaginatedData<T>;
