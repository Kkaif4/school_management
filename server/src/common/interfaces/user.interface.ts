import { Types } from 'mongoose';
import { SchoolDocument } from 'src/schema/school.schema';
import { UserDocument, UserRole } from 'src/schema/user.schema';

// User with populated school reference
export interface PopulatedUser
  extends Omit<UserDocument, 'schoolId' | 'password'> {
  schoolId?: SchoolDocument | Types.ObjectId; // populated or raw ID
}

// User type used in JWT payloads and responses (no password)
export type AuthUser = Omit<PopulatedUser, 'password'>;

// Payload stored inside JWT tokens
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role: UserRole;
  schoolId?: string;
  iat?: number;
  exp?: number;
}
