import { api } from './axios';

export interface Teacher {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  subject?: string;
  qualification?: string;
  contactNumber?: string;
  address?: string;
  gender?: 'male' | 'female' | 'other';
  schoolId: string;
}

interface TeacherArrayResponse {
  success: boolean;
  message: string;
  data: Teacher[];
}

export async function getTeachers(schoolId: string): Promise<{
  teachers: Teacher[];
  error?: string;
}> {
  try {
    const res = await api.get<TeacherArrayResponse>(`/user/school-teachers?schoolId=${schoolId}`);
    console.log('hello');
    return { teachers: res.data.data || [] };
  } catch (err: any) {
    const errorMsg = err?.response?.data?.message || 'Failed to fetch teachers';
    console.error('API getTeachers error:', errorMsg);
    return { teachers: [], error: errorMsg };
  }
}
