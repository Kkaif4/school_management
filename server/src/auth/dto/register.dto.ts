import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
}

export class RegisterDto {
  @ApiProperty({
    example: 'JohnDoe123',
    description:
      'Full name of the user. Must contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Valid email address of the user.',
  })
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  readonly email: string;

  @ApiPropertyOptional({
    enum: UserRole,
    description: 'Role of the user. Defaults to ADMIN if not provided.',
    example: UserRole.ADMIN,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(UserRole)
  readonly role?: UserRole;

  @ApiProperty({
    example: 'Password123',
    description:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  readonly password: string;
}
