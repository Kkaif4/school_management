import { z } from 'zod';

export enum Genders {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export const Divisions = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  '',
] as const;
export interface Student {
  _id: string;
  studentId: string;
  registrationNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: Genders;
  rollNumber: number;
  grade: number; // 1–12
  division: (typeof Divisions)[number];
  customFields?: { key: string; value: string }[];
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

export const studentSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  registrationNumber: z.string().min(1, 'Register Number is required'),
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
  gender: z.enum(['male', 'female', 'other']),
  rollNumber: z.string().min(1, 'Roll number is required'),
  grade: z.string().refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 1 && num <= 12;
    },
    { message: 'Grade must be a number between 1 and 12' }
  ),
  division: z.enum(Divisions, { required_error: 'Division is required' }),
  schoolId: z.string().min(1, 'School ID is required'),

  // Accept object instead of array
  customFields: z
    .record(z.string().min(1, 'Field value is required'))
    .optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;

export interface UpdateStudentRequest extends Partial<StudentFormData> {
  _id: string;
}
