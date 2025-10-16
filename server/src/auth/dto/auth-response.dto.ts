import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/schema/user.schema';

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  token: string;

  @ApiProperty({
    type: User,
    description: 'Registered user details',
  })
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
    schoolId?: string;
  };
}
