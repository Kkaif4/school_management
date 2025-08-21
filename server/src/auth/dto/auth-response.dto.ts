import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { User } from 'src/schema/user.schema';

export class AuthResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates whether registration was successful',
  })
  success: boolean;

  @ApiProperty({
    example: 'User registered successfully',
    description: 'Response message',
  })
  message: string;

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
    id: Types.ObjectId;
    email: string;
    role: string;
    name: string;
  };
}
