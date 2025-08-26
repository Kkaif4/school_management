import { api } from './axios';
import { Genders, Divisions } from '@/app/school/[id]/schema';
type Gender = (typeof Genders)[number];
type Division = (typeof Divisions)[number];
export interface Student {
  _id?: string;
  studentId: number;
  registerNumber: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string | Date;
  birthPlace: string;
  gender: Gender;
  rollNumber: number;
  fatherName: string;
  motherName: string;
  adhaar: number;
  cast: string;
  religion: string;
  nationality: string;
  grade: number;
  division: Division;
  contactNumber: string;
  address: string;
  previousSchoolName?: string;
  admissionDate: string | Date;
  schoolId: string;
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
    console.log(res.statusText);
    return { success: true, message: res.data.message };
  } catch (err: any) {
    console.log('got error: ', err);
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
