import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class LogResponseDto {
  @ApiProperty({
    example: '64e1a6b9e0f1a2b3c4d5e6f7',
    description: 'Unique identifier of the log document',
  })
  @Expose()
  _id: string;

  @ApiProperty({
    example: 'Student grade updated',
    description: 'Descriptive message of the log action',
  })
  @Expose()
  message: string;

  @ApiProperty({
    example: '64c9a6b9e0f1a2b3c4d5e6f7',
    description: 'Reference to the user who performed the action',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    example: '64d9a6b9e0f1a2b3c4d5e6f7',
    description: 'Reference to the student associated with the log',
  })
  @Expose()
  studentId: string;

  @ApiProperty({
    example: '64c1d7e9a1b2c3d4e5f6a7b8',
    description: 'Reference to the school associated with the log',
  })
  @Expose()
  schoolId: string;

  @ApiProperty({
    example: 'Certificate',
    description: 'Type of document involved in the action',
  })
  @Expose()
  documentType: string;

  @ApiProperty({
    example: '64e1b7c9e1f2a3b4c5d6e7f8',
    description: 'ID of the document involved in the action',
  })
  @Expose()
  documentId: string;

  @ApiProperty({
    example: 'update',
    description: 'Action performed (create, update, delete, etc.)',
  })
  @Expose()
  action: string;

  @ApiProperty({
    example: '2025-10-13T12:30:00.000Z',
    description: 'Timestamp when the log entry was created',
  })
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    example: '2025-10-13T12:30:00.000Z',
    description: 'Timestamp when the log entry was last updated',
  })
  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  constructor(partial: Partial<LogResponseDto>) {
    Object.assign(this, partial);
  }
}
