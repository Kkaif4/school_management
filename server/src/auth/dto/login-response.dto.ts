import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates whether registration was successful',
  })
  success: boolean;

  @ApiProperty({
    example: 'User logged in successfully',
    description: 'Response message',
  })
  message: string;
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  token: string;

  //role
  @ApiProperty({
    example: 'admin',
    description: 'User role',
  })
  role: string;
}
