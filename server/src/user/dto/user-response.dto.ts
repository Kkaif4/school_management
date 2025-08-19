import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/schema/user.schema';

export class UserResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates whether the operation was successful',
  })
  success: boolean;

  @ApiProperty({
    example: 'User fetched successfully',
    description: 'A descriptive message about the operation result',
  })
  message: string;

  @ApiProperty({
    type: () => User,
    description: 'The user data returned from the operation',
  })
  data: User;
}
