import { IsNotEmpty, Matches, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'Password123',
    description:
      'User password. Must contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  readonly password: string;
}
