import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({
    example: '64c9a6b9e0f1a2b3c4d5e6f7',
    description: 'Unique identifier of the user',
  })
  @Expose()
  _id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: '[johndoe@example.com](mailto:johndoe@example.com)',
    description: 'Unique email of the user',
  })
  @Expose()
  email: string;

  @ApiPropertyOptional({
    example: 'teacher',
    description: 'Role assigned to the user',
  })
  @Expose()
  role?: string;

  @ApiProperty({
    example: '64c9a6b9e0f1a2b3c4d5e6f7',
    description: 'School ID associated with the user',
  })
  @Expose()
  schoolId: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indicates if the user is active',
  })
  @Expose()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: '64c9a6b9e0f1a2b3c4d5e6f7',
    description: 'ID of the user who created this record',
  })
  @Expose()
  createdBy?: string;

  @ApiPropertyOptional({
    example: '64c9a6b9e0f1a2b3c4d5e6f7',
    description: 'ID of the user who last updated this record',
  })
  @Expose()
  updatedBy?: string;

  @ApiProperty({
    example: '2025-10-06T12:30:00.000Z',
    description: 'Date when the user was created',
  })
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    example: '2025-10-06T12:30:00.000Z',
    description: 'Date when the user was last updated',
  })
  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
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
