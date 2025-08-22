'use client';

import { getStudents, Student } from '@/api/students';
import { getTeachers, Teacher } from '@/api/teachers';
import { getSchoolById, School as SchoolType } from '@/api/school';
import { useSchoolStore } from '@/app/context/store';
import { fetchDashboardData } from '@/services/schoolDashboard.service';
import { useEffect, useState, use } from 'react';

export default function School({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [school, setSchool] = useState<SchoolType | null>(null);
  const { setSchool: setGlobalSchool } = useSchoolStore();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch school details
        const { school: schoolData, error: schoolError } = await getSchoolById(
          id
        );
        if (schoolError) throw new Error(schoolError);
        if (!schoolData) throw new Error('School not found');

        setSchool(schoolData);
        setGlobalSchool(schoolData);

        const dashboardData = await fetchDashboardData(id);
        setStudents(dashboardData.students);
        setTeachers(dashboardData.teachers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, setGlobalSchool]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">School not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">{school.name}</h1>
          {school.location && (
            <p className="text-gray-500 mt-1">{school.location}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Students
            </h2>
            {students.length > 0 ? (
              <p className="text-3xl font-bold text-indigo-600">
                {students.length}
              </p>
            ) : (
              <p className="text-gray-500">No students enrolled</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Teachers
            </h2>
            {teachers.length > 0 ? (
              <p className="text-3xl font-bold text-indigo-600">
                {teachers.length}
              </p>
            ) : (
              <p className="text-gray-500">No teachers assigned</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
