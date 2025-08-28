import { z } from 'zod';

export const Genders = ['male', 'female', 'other', ''] as const;
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

export const studentSchema = z.object({
  studentId: z
    .string({ error: 'Student ID must be a number' })
    .min(1, 'Student ID is required'),
  registerNumber: z
    .string({ error: 'Register Number must be a number' })
    .min(1, 'Register Number is required'),

  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),

  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),

  birthPlace: z.string().min(1, 'Birth place is required'),

  gender: z.enum(Genders, { error: 'Gender is required' }),

  rollNumber: z
    .string({ error: 'Roll Number must be a number' })
    .min(1, 'Roll number is required'),

  fatherName: z.string().min(1, 'Father name is required'),
  motherName: z.string().min(1, 'Mother name is required'),

  adhaar: z
    .string()
    .regex(
      /^[2-9][0-9]{11}$/,
      'Aadhaar must be 12 digits and cannot start with 0 or 1'
    ),

  cast: z.string().min(1, 'Cast is required'),
  religion: z.string().min(1, 'Religion is required'),
  nationality: z.string().min(1, 'Nationality is required'),

  grade: z
    .string({ error: 'Grade must be a number' })
    .min(1, 'Grade must be between 1 and 12')
    .max(12, 'Grade must be between 1 and 12'),

  division: z.enum(Divisions, { error: 'Division is required' }),

  contactNumber: z
    .string()
    .regex(/^[0-9]{10}$/, 'Contact number must be 10 digits'),

  address: z.string().min(5, 'Address must be at least 5 characters'),

  previousSchoolName: z.string().optional(),

  admissionDate: z
    .string()
    .min(1, 'Admission date is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),

  schoolId: z.string().min(1, 'School ID is required'),
});

export type StudentFormData = z.infer<typeof studentSchema>;

export const teacherSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['teacher', 'sub_admin']),
  schoolId: z.string().min(1, 'School ID is required'),
});

export type TeacherFormData = z.infer<typeof teacherSchema>;
