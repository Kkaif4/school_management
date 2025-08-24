import { z } from 'zod';

type Gender = 'male' | 'female' | 'other' | null;

export const studentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other', ''], {
    error: 'Gender is required',
  }),
  rollNumber: z.string().min(1, 'Roll number is required'),
  fatherName: z.string().min(1, 'Father name is required'),
  motherName: z.string().min(1, 'Mother name is required'),
  grade: z.string().min(1, 'Grade is required'),
  division: z.string().min(1, 'Division is required'),
  contactNumber: z
    .string()
    .regex(/^[0-9]{10}$/, 'Contact number must be 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  schoolId: z.string().min(1, 'School ID is required'),
});

export type StudentFormData = z.infer<typeof studentSchema>;
