import { api } from './axios';

export interface School {
  id: string;
  name: string;
  location?: string;
  createdAt?: string;
}

export async function getSchools(): Promise<{
  schools: School[];
  error?: string;
}> {
  try {
    const res = await api.get('/school');

    // Normalize the shape to fit component
    const schools: School[] = (res.data?.data || []).map((s: any) => ({
      id: s._id,
      name: s.name,
      location: s.address, // mapping "address" to "location"
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

    console.error('API getSchools error:', errorMsg);
    return { schools: [], error: errorMsg };
  }
}
