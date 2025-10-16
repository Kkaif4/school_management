import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CertificateResponseDto {
  @ApiProperty({
    example: '64d9a6b9e0f1a2b3c4d5e6f7',
    description: 'Unique identifier of the certificate document',
  })
  @Expose()
  _id: string;

  @ApiProperty({
    example: 'Participation Certificate',
    description: 'Human-readable name of the certificate',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'CERT-TEMPLATE-001',
    description: 'Unique code representing the certificate template used',
  })
  @Expose()
  templateCode: string;

  @ApiProperty({
    example: '64c1d7e9a1b2c3d4e5f6a7b8',
    description: 'Reference to the school associated with this certificate',
  })
  @Expose()
  schoolId: string;

  @ApiProperty({
    example: '2025-10-06T12:30:00.000Z',
    description: 'Timestamp indicating when the certificate record was created',
  })
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    example: '2025-10-06T12:30:00.000Z',
    description:
      'Timestamp indicating when the certificate record was last updated',
  })
  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  constructor(partial: Partial<CertificateResponseDto>) {
    Object.assign(this, partial);
  }
}
