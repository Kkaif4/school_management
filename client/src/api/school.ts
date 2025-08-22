import { api } from './axios';

export interface School {
  id: string;
  name: string;
  location?: string;
  createdAt?: string;
}

export async function getSchoolById(id: string): Promise<{
  school?: School;
  error?: string;
}> {
  try {
    const res = await api.get(`/school/${id}`);
    const schoolData = res.data?.data;
    if (!schoolData) {
      return { error: 'School not found' };
    }
    const school: School = {
      id: schoolData._id,
      name: schoolData.name,
      location: schoolData.address,
      createdAt: schoolData.createdAt,
    };
    return { school };
  } catch (err: any) {
    const errorMsg = err?.response?.data?.message || 'Failed to fetch school';
    console.error('API getSchoolById error:', errorMsg);
    return { error: errorMsg };
  }
}

export async function getSchools(): Promise<{
  schools: School[];
  error?: string;
}> {
  try {
    const res = await api.get('/school');
    const schools: School[] = (res.data?.data || []).map((s: any) => ({
      id: s._id,
      name: s.name,
      location: s.address,
      createdAt: s.createdAt,
    }));
    return { schools };
  } catch (err: any) {
    const errorMsg =
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      'Unknown error';

    if (err?.response?.status === 401) {
      localStorage.removeItem('user');
      return { schools: [], error: 'Please log in again to continue' };
    }

    console.log('API getSchools error:', errorMsg);
    return { schools: [], error: errorMsg };
  }
}
