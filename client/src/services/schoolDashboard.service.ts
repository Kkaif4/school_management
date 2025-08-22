import { getStudents } from '@/api/students';
import { getTeachers } from '@/api/teachers';

export async function fetchDashboardData(id: string) {
  if (!id) {
    return {
      students: [],
      teachers: [],
    };
  }

  try {
    const [studentsRes, teachersRes] = await Promise.all([
      getStudents(id),
      getTeachers(id),
    ]);

    return {
      students: studentsRes.students ?? [],
      teachers: teachersRes.teachers ?? [],
    };
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    return {
      students: [],
      teachers: [],
    };
  }
}
