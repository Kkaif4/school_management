'use client';

import { useState } from 'react';
import { Teacher } from '@/api/teachers';
import AddTeacherForm from './teacherForm';

interface TeachersProps {
  schoolId: string;
  teachers: Teacher[];
  error: string | null;
  loading: boolean;
}

export default function Teachers({
  schoolId,
  teachers,
  error,
  loading,
}: TeachersProps) {
  const [showForm, setShowForm] = useState(false);

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Teachers</h2>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {showForm ? 'Cancel' : '+ Add Teacher'}
        </button>
      </div>

      {showForm && <AddTeacherForm schoolId={schoolId} />}

      {teachers.length > 0 ? (
        <div className="space-y-3 mt-4">
          {/* Count */}
          <p className="text-3xl font-bold text-indigo-600">
            {teachers.length} Teacher{teachers.length > 1 ? 's' : ''}
          </p>

          {/* List */}
          <ul className="divide-y divide-gray-200 border rounded-lg">
            {teachers.map((teacher) => (
              <li
                key={teacher._id}
                className="p-3 flex justify-between items-center text-sm">
                <span className="font-medium text-gray-800">
                  {teacher.name}
                </span>
                <span className="text-gray-500">{teacher.email}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No teachers found</p>
      )}
    </div>
  );
}
