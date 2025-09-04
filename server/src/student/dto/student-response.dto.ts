import { ApiProperty } from '@nestjs/swagger';

import { Student } from '../../schema/student.schema';

export class StudentResponseDto {
  @ApiProperty({ description: 'Whether the request was successful' })
  success: boolean;

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Student data', type: Student })
  data: Student;
}
