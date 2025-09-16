import {
  Min,
  Max,
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
  IsMongoId,
  IsOptional,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, Divisions } from 'src/schema/student.schema';

export class CreateStudentDto {
  @ApiProperty({
    example: '123456',
    description: 'Registration number of the student',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    example: '123456',
    description: 'Registration number of the student',
  })
  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @ApiProperty({
    example: 'John',
    description: 'First name of the student',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional({
    example: 'Michael',
    description: 'Middle name of the student',
  })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the student',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: '2010-05-14',
    description: 'Date of birth in ISO format (YYYY-MM-DD)',
  })
  @IsDateString(
    {},
    { message: 'dateOfBirth must be a valid ISO date (YYYY-MM-DD)' },
  )
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty({
    enum: Gender,
    example: Gender.MALE,
    description: 'Gender of the student',
  })
  @IsEnum(Gender, { message: 'gender must be male, female, or other' })
  @IsNotEmpty()
  gender: Gender;

  @ApiPropertyOptional({
    enum: Divisions,
    example: Divisions.B,
    description: 'Division of the student (default: A)',
  })
  @IsEnum(Divisions, { message: 'division must be one of A–I' })
  @IsOptional()
  division?: Divisions;

  @ApiProperty({
    example: 23,
    description: 'Roll number of the student',
  })
  @IsNumber()
  @IsNotEmpty()
  rollNumber: number;

  @ApiProperty({
    example: 8,
    description: 'Grade of the student (1–12)',
    minimum: 1,
    maximum: 12,
  })
  @IsNumber()
  @Min(1, { message: 'grade must be at least 1' })
  @Max(12, { message: 'grade cannot be greater than 12' })
  @IsNotEmpty()
  grade: number;

  @ApiProperty({
    example: '64c9a6b9e0f1a2b3c4d5e6f7',
    description: 'MongoDB ObjectId of the school the student belongs to',
  })
  @IsMongoId({ message: 'schoolId must be a valid Mongo ObjectId' })
  @IsNotEmpty()
  schoolId: string;

  @ApiPropertyOptional({
    example: {
      bloodGroup: 'O+',
      hobbies: ['cricket', 'music'],
      busRoute: 12,
    },
    description:
      'Dynamic custom fields for additional student information. Accepts key-value pairs.',
    type: Object,
  })
  @IsObject({ message: 'customFields must be an object with key-value pairs' })
  @IsOptional()
  customFields: Map<string, any>;
}
