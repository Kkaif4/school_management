import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateLogDto {
  @ApiProperty({
    description: 'ID of the user performing the action',
    example: '64f123abc456def789012345',
  })
  @IsMongoId({ message: 'Invalid userId format' })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'ID of the student related to this log',
    example: '64f987abc456def123456789',
  })
  @IsMongoId({ message: 'Invalid studentId format' })
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'ID of the school related to this log',
    example: '64f987abc456def123456789',
  })
  @IsMongoId({ message: 'Invalid schoolId format' })
  @IsNotEmpty()
  schoolId: string;

  @ApiProperty({
    description: 'Type of document (e.g., certificate, ID card, transcript)',
    example: 'certificate',
  })
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty({
    description: 'ID of the document related to this log',
    example: '64fabcd123456def789012345',
  })
  @IsMongoId({ message: 'Invalid documentId format' })
  @IsNotEmpty()
  documentId: string;

  @ApiProperty({
    description: 'Message describing the log event',
    example: 'Student certificate was generated successfully',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Action performed (e.g., CREATE, UPDATE, DELETE)',
    example: 'CREATE',
  })
  @IsString()
  @IsNotEmpty()
  action: string;
}
