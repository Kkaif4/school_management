import {
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

import { Gender, Divisions } from 'src/schema/student.schema';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  middleName?: string; // optional

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  rollNumber: string;

  @IsString()
  @IsNotEmpty()
  fatherName: string;

  @IsString()
  @IsNotEmpty()
  motherName: string;

  @IsNumber()
  grade: number;

  @IsEnum(Divisions)
  division: Divisions;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @IsString()
  address?: string;

  @IsString()
  @IsNotEmpty()
  schoolId: string;
}
