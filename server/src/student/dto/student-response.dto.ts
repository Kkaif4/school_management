import { ApiProperty } from '@nestjs/swagger';

import { Student } from '../../schema/student.schema';

export class StudentResponseDto {
  @ApiProperty({ description: 'Whether the request was successful' })
  success: boolean;

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Student data', type: Student })
  data: Student;
}

export interface StudentArrayResponse {
  success: boolean;
  message: string;
  total?: number;
  data: Student[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CSVError {
  row: Record<string, any>;
  error: string;
  type: 'DUPLICATE' | 'VALIDATION';
}

export interface CSVProcessingSummary {
  total: number;
  saved: number;
  failed: number;
  duplicates: number;
  validationFailed: number;
}

export interface CSVProcessingResult {
  success: boolean;
  message: string;
  summary: CSVProcessingSummary;
  errors: CSVError[];
  results: Student[];
}
