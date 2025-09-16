import { z } from 'zod';

export type CustomField = {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;
};
export interface School {
  _id: string;
  name: string;
  address: string;
  principalName: string;
  totalStudents: number;
  totalTeachers: number;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: string;
  updatedAt: string;
  contactNumber: string;
  studentFields: CustomField[];
}

export const createSchoolSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  principalName: z.string().min(1, 'Principal name is required'),
  adminId: z.string().min(1, 'Admin ID is required'),
  address: z.string().optional(),
  contactNumber: z.string().optional(),
  isActive: z.boolean().default(true),
});

export interface CreateSchoolRequest {
  name: string;
  adminId: string;
  principalName: string;
  contactNumber: String;
  address: string;
  isActive: boolean;
}

export interface UpdateSchoolRequest extends Partial<CreateSchoolRequest> {
  id: string;
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
