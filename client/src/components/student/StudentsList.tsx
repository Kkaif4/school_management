import { Users } from 'lucide-react';
import { studentAPI } from '@/lib/api';
import { Student } from '@/types/student';

interface StudentsListProps {
  students: Student[];
  filteredStudents: Student[];
  onStudentClick: (student: Student) => void;
}

export default function StudentsList({
  students,
  filteredStudents,
  onStudentClick,
}: StudentsListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-700">
          Showing {filteredStudents.length} of {students.length} students
        </p>
      </div>
      <ul className="divide-y divide-gray-200">
        {filteredStudents.map((student) => (
          <li
            key={student._id}
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onStudentClick(student)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {student.firstName} {student.lastName}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-500">
                      Roll: {student.rollNumber}
                    </span>
                    {student.grade && (
                      <span className="text-sm text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                        Grade {student.grade}
                      </span>
                    )}
                    {student.division && (
                      <span className="text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        Division {student.division}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:bg-indigo-50 px-3 py-1 rounded-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onStudentClick(student);
                }}>
                View Details
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
