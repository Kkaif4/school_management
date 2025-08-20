import { ApiProperty } from '@nestjs/swagger';
import {
  Max,
  Min,
  IsEnum,
  IsNumber,
  IsMongoId,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Types } from 'mongoose';
import { Sections } from 'src/schema/class.schema';

export class CreateClassDto {
  @ApiProperty({
    example: 5,
    description: 'Grade level of the class',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(12)
  grade: number;

  @ApiProperty({
    example: 'A',
    description: 'Section of the class (A to I)',
    enum: Sections,
    required: false,
  })
  @IsOptional()
  @IsEnum(Sections)
  section: Sections;

  @ApiProperty({
    example: '64c9a6b9e0f1a2b3c4d5e6f7',
    description: 'Associated school ID',
  })
  @IsNotEmpty()
  @IsMongoId()
  schoolId: Types.ObjectId;

  @ApiProperty({
    example: '64c9a6b9e0f1a2b3c4d5e6f7',
    description: 'Associated teacher ID',
  })
  @IsNotEmpty()
  @IsMongoId()
  createdBy: Types.ObjectId;
}
