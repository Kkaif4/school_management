import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Unique email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'Password123',
    description:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  readonly password: string;

  @ApiProperty({
    example: 'teacher',
    description: 'Role of the user',
    required: false,
  })
  @IsOptional()
  @Matches('^teacher')
  role: string;

  @ApiProperty({
    type: String,
    example: '64c9a6b9e0f1a2b3c4d5e6f7',
    description: 'school ID the user is associated with',
    required: true,
  })
  @IsMongoId()
  readonly schoolId: string;

  @ApiProperty({
    example: true,
    description: 'User active status (default true)',
    required: false,
  })
  @IsOptional()
  readonly isActive?: boolean;
}
