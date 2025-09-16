import { GraduationCap, Users, BarChart3 } from 'lucide-react';

interface StatsOverviewProps {
  school: {
    totalStudents?: number;
    totalTeachers?: number;
  };
}

export default function StatsOverview({ school }: StatsOverviewProps) {
  return (
    <div className="p-4">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {/* Students Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Students
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {school.totalStudents || 0}
              </p>
            </div>
            <div className="bg-indigo-50 p-2 rounded-full sm:p-3">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex items-center text-xs sm:text-sm text-green-600">
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Active enrollment
          </div>
        </div>

        {/* Teachers Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Teachers
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {school.totalTeachers || 0}
              </p>
            </div>
            <div className="bg-purple-50 p-2 rounded-full sm:p-3">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 flex items-center text-xs sm:text-sm text-green-600">
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Faculty strength
          </div>
        </div>
      </div>
    </div>
  );
}
