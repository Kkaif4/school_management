import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';

import { UserRole } from 'src/schema/user.schema';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsNotEmpty()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Unique email address',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email?: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Secure password with uppercase, lowercase, and number',
  })
  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  readonly password?: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.TEACHER,
    description: 'Role of the user',
  })
  @IsOptional()
  @IsEnum(UserRole)
  readonly role?: UserRole;

  @ApiProperty({
    type: [String],
    example: ['64c9a6b9e0f1a2b3c4d5e6f7'],
    description: 'Array of school ObjectIds the user is associated with',
  })
  @IsOptional()
  readonly school?: Types.ObjectId[];

  @ApiProperty({ example: true, description: 'User active status' })
  @IsOptional()
  readonly isActive?: boolean;
}
