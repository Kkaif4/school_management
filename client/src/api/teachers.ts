import { api } from './axios';

interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  // Add other teacher properties as needed
}

export async function getTeachers(): Promise<{
  teachers: Teacher[];
  error?: string;
}> {
  try {
    const res = await api.get('/teachers');
    return { teachers: res.data.teachers || [] };
  } catch (err: any) {
    const errorMsg = err?.response?.data?.message || 'Failed to fetch teachers';
    console.error('API getTeachers error:', errorMsg);
    return { teachers: [], error: errorMsg };
  }
}
