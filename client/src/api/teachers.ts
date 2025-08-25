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
    const res = await api.get<Teacher[]>(`/user/teachers?school=${schoolId}`);
    console.log(res.data);
    return { teachers: res.data };
  } catch (err: any) {
    const errorMsg = err?.response?.data?.message || 'Failed to fetch teachers';
    return { teachers: [], error: errorMsg };
  }
}

type addTeacher = {
  name: string;
  email: string;
  password: string;
  role: string;
  schoolId: string;
};
export async function addTeacher(
  teacherData: addTeacher
): Promise<{ success: boolean; message: string }> {
  console.log('adding teacher with this data: ', teacherData);
  try {
    const res = await api.post('/user/', teacherData);
    return { success: true, message: res.data.message };
  } catch (err: any) {
    const errorMsg = err?.response?.data?.message || 'Failed to add teacher';
    return { success: false, message: errorMsg };
  }
}
