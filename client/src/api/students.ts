import { api } from './axios';

export interface Student {
  _id?: string; // Optional for creation
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string | Date;
  gender?: 'male' | 'female' | 'other';
  rollNumber?: string;
  fatherName?: string;
  motherName?: string;
  schoolId: string;
  division?: string;
  grade: string;
  contactNumber?: string;
  address?: string;
}

interface StudentArrayResponse {
  success: boolean;
  message: string;
  data: Student[];
}

export async function getStudents(schoolId: string): Promise<{
  students: Student[];
  error?: string;
}> {
  try {
    const res = await api.get<StudentArrayResponse>(`/student/${schoolId}`);
    return { students: res.data.data || [] };
  } catch (err: any) {
    const errorMsg = err?.response?.data?.message || 'Failed to fetch students';
    return { students: [], error: errorMsg };
  }
}

export async function addStudent(
  studentData: Student
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await api.post('/student', studentData);
    return { success: true, message: res.data.message };
  } catch (err: any) {
    const errorMsg = err?.response?.data?.message || 'Failed to add student';
    return { success: false, message: errorMsg };
  }
}
