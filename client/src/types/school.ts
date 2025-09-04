import { z } from 'zod';

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
