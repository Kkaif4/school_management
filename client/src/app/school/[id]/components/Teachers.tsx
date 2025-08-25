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
  const [isFormOpen, setIsFormOpen] = useState(false);

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
    <div className="bg-white p-6 rounded-lg shadow-sm border text-black border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Students</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
          + Add Student
        </button>
      </div>

      {teachers.length > 0 ? (
        <div className="space-y-3">
          {/* Count */}
          <p className="text-3xl font-bold text-indigo-600">
            {teachers.length} Student{teachers.length > 1 ? 's' : ''}
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
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500">No teachers enrolled</p>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-7xl relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              ✕
            </button>

            <AddTeacherForm
              schoolId={schoolId}
              onSuccess={() => setIsFormOpen(false)}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
