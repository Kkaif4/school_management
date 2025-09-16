import {
  IsIn,
  IsArray,
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsPhoneNumber,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsStrictBoolean } from 'src/decorators/boolean.decorator';

export class FieldDefinitionDto {
  @ApiProperty({
    example: 'bloodGroup',
    description: 'Name of the custom student field',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'string',
    description: 'Data type of the field (string, number, boolean, date, etc.)',
    enum: ['string', 'number', 'boolean', 'date', 'object', 'array'],
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['string', 'number', 'boolean', 'date', 'object', 'array'])
  type: string;

  @ApiProperty({
    example: true,
    description: 'Whether this field is required',
  })
  @IsStrictBoolean()
  @IsNotEmpty()
  required: boolean;

  @ApiProperty({
    example: 'O+',
    description: 'Default value for the field (can be any type)',
    required: false,
  })
  @IsOptional()
  defaultValue?: any;
}

export class CreateSchoolDto {
  @ApiProperty({
    example: '64f123abc456def789012345',
    description: 'ID of the school',
  })
  @IsNotEmpty()
  @IsMongoId({ message: 'Invalid schoolId format' })
  readonly adminId: string;

  @ApiProperty({
    example: 'English School',
    description: 'Name of the school',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Principal name of the school',
  })
  @IsNotEmpty()
  @IsString()
  readonly principalName: string;

  @ApiProperty({
    example: '123 Main Street, City, Country',
    description: 'Physical address of the school',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly address?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Contact number of the school',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber(undefined, {
    message: 'Contact Number must be a valid phone number',
  })
  readonly contactNumber?: string;

  @ApiProperty({
    type: [FieldDefinitionDto],
    description: 'Custom fields for students defined by the school',
    required: false,
    example: [
      {
        name: 'bloodGroup',
        type: 'string',
        required: false,
      },
      {
        name: 'sportsPreference',
        type: 'string',
        required: true,
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldDefinitionDto)
  readonly studentFields?: FieldDefinitionDto[];

  @ApiProperty({
    example: true,
    description: 'School active status',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}
