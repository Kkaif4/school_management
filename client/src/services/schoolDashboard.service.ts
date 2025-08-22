import { getStudents } from '@/api/students';
import { getTeachers } from '@/api/teachers';

export async function fetchDashboardData(id: string) {
  try {
    const [studentsRes, teachersRes] = await Promise.all([
      getStudents(id),
      getTeachers(id),
    ]);

    return {
      students: studentsRes.students,
      teachers: teachersRes.teachers,
    };
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    return {
      students: [],
      teachers: [],
    };
  }
}
