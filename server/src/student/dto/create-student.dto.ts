import {
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Length,
  Min,
  Max,
  IsMongoId,
  Matches,
} from 'class-validator';

import { Gender, Divisions } from 'src/schema/student.schema';

export class CreateStudentDto {
  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @IsNumber()
  @IsNotEmpty()
  registerNumber: number;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsString()
  @IsNotEmpty()
  birthPlace: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsNumber()
  @IsNotEmpty()
  rollNumber: number;

  @IsString()
  @IsNotEmpty()
  fatherName: string;

  @IsString()
  @IsNotEmpty()
  motherName: string;

  @IsString()
  @IsNotEmpty()
  @Length(12, 12, { message: 'Aadhaar must be exactly 12 digits' })
  @Matches(/^[2-9][0-9]{11}$/, {
    message: 'Aadhaar must be 12 digits and cannot start with 0 or 1',
  })
  adhaar: string;

  @IsString()
  @IsNotEmpty()
  cast: string;

  @IsString()
  @IsNotEmpty()
  religion: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsNumber()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  grade: number;

  @IsEnum(Divisions)
  @IsNotEmpty()
  division: Divisions;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  previousSchoolName?: string;

  @IsDateString()
  @IsNotEmpty()
  admissionDate: string;

  @IsMongoId()
  @IsNotEmpty()
  schoolId: string;
}
