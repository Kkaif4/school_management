import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class FieldDefinitionResponseDto {
  @ApiProperty({
    example: 'dateOfBirth',
    description: 'Name of the custom student field',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'string',
    description: 'Data type of the field (e.g., string, number, date, etc.)',
  })
  @Expose()
  type: string;

  @ApiProperty({
    example: true,
    description:
      'Indicates if this field is mandatory for student registration',
  })
  @Expose()
  required: boolean;

  @ApiPropertyOptional({
    example: 'N/A',
    description: 'Default value of the field if not provided',
  })
  @Expose()
  defaultValue?: any;
}

export class SchoolResponseDto {
  @ApiProperty({
    example: '64c9a6b9e0f1a2b3c4d5e6f7',
    description: 'Unique identifier of the school',
  })
  @Expose()
  _id: string;

  @ApiProperty({
    example: 'Green Valley High School',
    description: 'Official name of the school',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'Mrs. Angela Morris',
    description: 'Full name of the school principal',
  })
  @Expose()
  principalName: string;

  @ApiProperty({
    example: '64d1e7f9a1b2c3d4e5f6a7b8',
    description: 'Admin ID (User ID) associated with the school',
  })
  @Expose()
  adminId: string;

  @ApiPropertyOptional({
    example: '123 Elm Street, Springfield',
    description: 'Registered address of the school',
  })
  @Expose()
  address?: string;

  @ApiPropertyOptional({
    example: '+1-202-555-0123',
    description: 'Primary contact number of the school',
  })
  @Expose()
  contactNumber?: string;

  @ApiProperty({
    example: 1500,
    description: 'Total number of enrolled students',
  })
  @Expose()
  totalStudents: number;

  @ApiProperty({
    example: 75,
    description: 'Total number of teachers currently employed',
  })
  @Expose()
  totalTeachers: number;

  @ApiProperty({
    type: [FieldDefinitionResponseDto],
    description: 'Dynamic list of additional student field definitions',
  })
  @Expose()
  @Type(() => FieldDefinitionResponseDto)
  studentFields: FieldDefinitionResponseDto[];

  @ApiProperty({
    example: true,
    description: 'Indicates if the school is active in the system',
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    example: '2025-10-06T12:30:00.000Z',
    description: 'Timestamp of when the school record was created',
  })
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    example: '2025-10-06T12:30:00.000Z',
    description: 'Timestamp of when the school record was last updated',
  })
  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  constructor(partial: Partial<SchoolResponseDto>) {
    Object.assign(this, partial);
  }
}
