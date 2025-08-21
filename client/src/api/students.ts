import { api } from './axios';

interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  // Add other student properties as needed
}

export async function getStudents(): Promise<{
  students: Student[];
  error?: string;
}> {
  try {
    const res = await api.get('/students');
    return { students: res.data.students || [] };
  } catch (err: any) {
    const errorMsg = err?.response?.data?.message || 'Failed to fetch students';
    console.error('API getStudents error:', errorMsg);
    return { students: [], error: errorMsg };
  }
}
