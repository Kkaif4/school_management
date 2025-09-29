import React from 'react';
import { GraduationCap, Users, BarChart3 } from 'lucide-react';

interface StatsOverviewProps {
  school: {
    totalStudents?: number;
    totalTeachers?: number;
  };
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  subText: string;
  iconBg?: string;
  iconColor?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  subText,
  iconBg = 'bg-gray-100',
  iconColor = 'text-gray-700',
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600">
            {label}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${iconBg} p-2 rounded-full sm:p-3`}>
          {React.cloneElement(icon as React.ReactElement, {
            className: `${iconColor} h-4 w-4 sm:h-5 sm:w-5`,
          })}
        </div>
      </div>
      <div className="mt-2 sm:mt-3 flex items-center text-xs sm:text-sm text-green-600">
        <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        {subText}
      </div>
    </div>
  );
}
