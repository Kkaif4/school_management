import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsMongoId,
  IsPhoneNumber,
} from 'class-validator';

export class CreateSchoolDto {
  @ApiProperty({
    example: 'English School',
    description: 'name of the school',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Principal name of the school',
  })
  @IsString()
  readonly principalName: string;

  @ApiProperty({
    example: '64c9a6b9e0f1a2b3c4d5e6f7',
    description: 'User ID of the principal',
  })
  @IsMongoId()
  adminId: string;

  @ApiProperty({
    example: '123 Main Street, City, Country',
    description: 'Physical address of the school',
  })
  @IsString()
  @IsOptional()
  readonly address?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Contact number of the school',
  })
  @IsString()
  @IsOptional()
  @IsPhoneNumber()
  readonly contactNumber?: string;

  @ApiProperty({
    example: true,
    description: 'School active status',
  })
  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;
}
