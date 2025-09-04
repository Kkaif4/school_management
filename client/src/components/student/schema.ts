// import { z } from 'zod';

// export const Genders = ['male', 'female', 'other', ''] as const;
// export const Divisions = [
//   'A',
//   'B',
//   'C',
//   'D',
//   'E',
//   'F',
//   'G',
//   'H',
//   'I',
//   '',
// ] as const;

// export const studentSchema = z.object({
//   studentId: z.string().min(1, 'Student ID is required'),
//   registerNumber: z.string().min(1, 'Register Number is required'),
//   firstName: z.string().min(1, 'First name is required'),
//   middleName: z.string().optional(),
//   lastName: z.string().min(1, 'Last name is required'),
//   dateOfBirth: z
//     .string()
//     .min(1, 'Date of birth is required')
//     .refine((val) => !isNaN(Date.parse(val)), {
//       message: 'Invalid date format',
//     }),
//   birthPlace: z.string().min(1, 'Birth place is required'),
//   gender: z.enum(Genders, { required_error: 'Gender is required' }),
//   rollNumber: z.string().min(1, 'Roll number is required'),
//   fatherName: z.string().min(1, 'Father name is required'),
//   motherName: z.string().min(1, 'Mother name is required'),
//   adhaar: z
//     .string()
//     .regex(
//       /^[2-9][0-9]{11}$/,
//       'Adhaar must be 12 digits and cannot start with 0 or 1'
//     ),
//   cast: z.string().min(1, 'Cast is required'),
//   religion: z.string().min(1, 'Religion is required'),
//   nationality: z.string().min(1, 'Nationality is required'),
//   grade: z.string().refine(
//     (val) => {
//       const num = Number(val);
//       return !isNaN(num) && num >= 1 && num <= 12;
//     },
//     { message: 'Grade must be a number between 1 and 12' }
//   ),
//   division: z.enum(Divisions, { required_error: 'Division is required' }),
//   contactNumber: z.string(),
//   address: z.string().min(5, 'Address must be at least 5 characters'),
//   previousSchoolName: z.string().optional(),

//   admissionDate: z
//     .string()
//     .min(1, 'Admission date is required')
//     .refine((val) => !isNaN(Date.parse(val)), {
//       message: 'Invalid date format',
//     }),
//   customFields: z
//     .array(
//       z.object({
//         fieldName: z.string().min(1, 'Field name is required'),
//         fieldValue: z.string().min(1, 'Field value is required'),
//       })
//     )
//     .optional(),
//   schoolId: z.string().min(1, 'School ID is required'),
// });

// export type StudentFormData = z.infer<typeof studentSchema>;

// export const teacherSchema = z.object({
//   name: z.string().min(1, 'Name is required'),
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters long'),
//   role: z.enum(['teacher', 'sub_admin'], {
//     required_error: 'Role is required',
//   }),
//   schoolId: z.string().min(1, 'School ID is required'),
// });

// export type TeacherFormData = z.infer<typeof teacherSchema>;
