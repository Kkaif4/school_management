import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Divisions, Gender } from '../../schema/student.schema';
import { Expose, Transform, Type } from 'class-transformer';
import { Student } from '../../schema/student.schema';
export interface CustomFields {
  [key: string]: any;
}

export class CustomFieldEntry {
  @Expose()
  key: string;

  @Expose()
  value: string | number | boolean | Date;
}

export class StudentResponseDto {
  @ApiProperty({
    example: '64d9a6b9e0f1a2b3c4d5e6f7',
    description: 'Unique identifier of the student document',
  })
  @Expose()
  _id: string;

  @ApiProperty({
    example: 'STU-2025-001',
    description: 'System-generated unique student ID',
  })
  @Expose()
  studentId: string;

  @ApiProperty({
    example: 'REG-2025-015',
    description: 'Official registration number assigned to the student',
  })
  @Expose()
  registrationNumber: string;

  @ApiProperty({
    example: 'John',
    description: 'First name of the student',
  })
  @Expose()
  firstName: string;

  @ApiPropertyOptional({
    example: 'Michael',
    description: 'Middle name of the student, if available',
  })
  @Expose()
  middleName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the student',
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    example: '2010-04-15T00:00:00.000Z',
    description: 'Date of birth of the student',
  })
  @Expose()
  @Type(() => Date)
  dateOfBirth: Date;

  @ApiProperty({
    enum: Gender,
    example: Gender.MALE,
    description: 'Gender of the student',
  })
  @Expose()
  gender: Gender;

  @ApiProperty({
    enum: Divisions,
    example: Divisions.A,
    description: 'Division to which the student is assigned',
  })
  @Expose()
  division: Divisions;

  @ApiProperty({
    example: '15',
    description: 'Roll number assigned to the student in the class/division',
  })
  @Expose()
  rollNumber: string;

  @ApiProperty({
    example: 10,
    description: 'Academic grade or standard of the student',
  })
  @Expose()
  grade: number;

  @ApiProperty({
    example: { age: 18, birthPlace: 'latur' },
    description: 'Custom dynamic fields defined by the school (key-value map)',
  })
  @Expose()
  @Transform(({ value }) => {
    if (!value) return [];
    const entries =
      value instanceof Map
        ? Array.from(value.entries())
        : Object.entries(value);
    return entries.map(([key, val]) => {
      const entry = new CustomFieldEntry();
      entry.key = key;
      entry.value = val;
      return entry;
    });
  })
  customFields: CustomFieldEntry[];

  @ApiProperty({
    example: '64d1e7f9a1b2c3d4e5f6a7b8',
    description: 'Reference to the school ID to which the student belongs',
  })
  @Expose()
  schoolId: string;

  @ApiProperty({
    example: '2025-10-06T12:30:00.000Z',
    description: 'Timestamp indicating when the student record was created',
  })
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    example: '2025-10-06T12:30:00.000Z',
    description:
      'Timestamp indicating when the student record was last updated',
  })
  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  constructor(partial: Partial<StudentResponseDto>) {
    Object.assign(this, partial);
  }
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
