import { z } from 'zod';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  SUB_ADMIN = 'sub_admin',
  TEACHER = 'teacher',
}

export interface Teacher {
  _id: string;
  name: string;
  email: string;
  role: UserRole; // will always be "teacher" in this case
  schoolId: string;
  isActive: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export const teacherSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.nativeEnum(UserRole).default(UserRole.TEACHER),
  schoolId: z.string().min(1, 'School ID is required'),
  isActive: z.boolean().default(true),
});

export type TeacherFormData = z.infer<typeof teacherSchema>;

export interface UpdateTeacherRequest extends Partial<TeacherFormData> {
  id: string;
}
