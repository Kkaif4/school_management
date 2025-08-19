import { ApiProperty } from '@nestjs/swagger';
import { School } from 'src/schema/school.schema';

export class SchoolResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty({
    example: 'School fetched successfully',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({ description: 'School data' })
  data: School;
}
