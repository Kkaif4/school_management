import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCertificateDto {
  @ApiProperty({
    example: 'Bonafide Certificate',
    description: 'Name of the certificate template',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example:
      '<html><body><h2>BONAFIDE CERTIFICATE</h2><p>This is to certify that {{student_name}} ...</p></body></html>',
    description: 'HTML template string with placeholders for dynamic fields',
  })
  @IsNotEmpty()
  @IsString()
  templateCode: string;

  @ApiProperty({
    example: '64c9a6b9e0f1a2b3c4d5e6f7',
    description: 'ID of the school this certificate belongs to',
  })
  @IsNotEmpty()
  @IsMongoId()
  schoolId: string;
}
