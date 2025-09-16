import { Trash, Users } from 'lucide-react';
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
            className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Left Section */}
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <div className="bg-indigo-100 p-2.5 sm:p-3 rounded-full flex-shrink-0">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                    {student.firstName} {student.lastName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                    <span className="text-xs sm:text-sm text-gray-500">
                      Roll: {student.rollNumber}
                    </span>
                    {student.grade && (
                      <span className="text-xs sm:text-sm text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                        Grade {student.grade}
                      </span>
                    )}
                    {student.division && (
                      <span className="text-xs sm:text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        Division {student.division}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section - Buttons */}
              <div className="flex gap-2 items-center mt-2 sm:mt-0">
                <button
                  className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:bg-indigo-50 px-3 py-1 rounded-md transition-colors"
                  onClick={() => onStudentClick(student)}>
                  View Details
                </button>

                <button className="text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium hover:bg-red-50 px-3 py-1 rounded-md transition-colors flex items-center gap-1">
                  <Trash className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
