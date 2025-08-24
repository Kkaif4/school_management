import { api } from './axios';
export interface Teacher {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  role: string;
  schoolId: string;
  __v: number;
}

export async function getTeachers(schoolId: string): Promise<{
  teachers: Teacher[];
  error?: string;
}> {
  try {
    console.log('schoolId', schoolId);
    const res = await api.get<Teacher[]>(`/user/teachers?school=${schoolId}`);
    console.log(res.data);
    return { teachers: res.data };
  } catch (err: any) {
    const errorMsg = err?.response?.data?.message || 'Failed to fetch teachers';
    console.log('API getTeachers error:', errorMsg);
    return { teachers: [], error: errorMsg };
  }
}
