import { api } from './axios';

export interface Student {
  _id?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string | Date;
  gender: 'male' | 'female' | 'other' | '';
  rollNumber: string;
  fatherName: string;
  motherName: string;
  schoolId: string;
  division: string;
  grade: string;
  contactNumber: string;
  address: string;
}

export async function getStudents(schoolId: string): Promise<{
  success: boolean;
  students: Student[];
  error?: string;
}> {
  try {
    const res = await api.get(`/student/${schoolId}`);
    console.log(res.data);
    return { success: true, students: res.data.data || [] };
  } catch (err: any) {
    const errorMsg = err?.response?.data?.message || 'Failed to fetch students';
    return { success: false, students: [], error: errorMsg };
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

export async function deleteStudent(
  studentId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await api.delete(`/student/${studentId}`);
    return { success: true, message: 'student deleted successfully' };
  } catch (err: any) {
    const errorMsg = err?.response?.data?.message || 'Failed to add student';
    return { success: false, message: errorMsg };
  }
}
