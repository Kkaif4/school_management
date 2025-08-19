import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/schema/user.schema';

export class RegisterResponseDto {
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
    type: User,
    description: 'Registered user details',
  })
  data: User;
}
