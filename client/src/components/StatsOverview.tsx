// components/StatsOverview.tsx
import { GraduationCap, Users, BarChart3, Calendar } from 'lucide-react';

interface StatsOverviewProps {
  students: any[];
  teachers: any[];
}

export default function StatsOverview({
  students,
  teachers,
}: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Students</p>
            <p className="text-3xl font-bold text-gray-900">
              {students.length}
            </p>
          </div>
          <div className="bg-indigo-50 p-3 rounded-full">
            <GraduationCap className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-green-600">
          <BarChart3 className="h-4 w-4 mr-1" />
          Active enrollment
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Teachers</p>
            <p className="text-3xl font-bold text-gray-900">
              {teachers.length}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-full">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-green-600">
          <BarChart3 className="h-4 w-4 mr-1" />
          Faculty strength
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Student-Teacher Ratio
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {teachers.length > 0
                ? Math.round(students.length / teachers.length)
                : 0}
              :1
            </p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-full">
            <BarChart3 className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-blue-600">
          <Calendar className="h-4 w-4 mr-1" />
          Current ratio
        </div>
      </div>
    </div>
  );
}
