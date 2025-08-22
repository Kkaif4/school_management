'use client';

import { useState, useEffect } from 'react';
import { School } from '@/api/school';
import { X, Users, GraduationCap, BarChart3 } from 'lucide-react';

interface SchoolDashboardProps {
  school: School;
  data: {
    students: any[];
    teachers: any[];
  } | null;
  onClose: () => void;
}

export const SchoolDashboard = ({
  school,
  data,
  onClose,
}: SchoolDashboardProps) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'students' | 'teachers'
  >('overview');
  const [loading, setLoading] = useState(!data);

  // 👉 Stop loading when `data` is resolved (even if null)
  useEffect(() => {
    setLoading(false);
  }, [data]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'teachers', label: 'Teachers', icon: Users },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    // 🚨 Show not found if no data at all
    if (!data) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg font-medium">Data not found</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Students
                  </h3>
                  <GraduationCap className="h-5 w-5 text-indigo-500" />
                </div>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {data.students.length}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  Total enrolled students
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Teachers
                  </h3>
                  <Users className="h-5 w-5 text-indigo-500" />
                </div>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {data.teachers.length}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  Active teaching staff
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Classes</h3>
                  <BarChart3 className="h-5 w-5 text-indigo-500" />
                </div>
                <p className="text-2xl font-semibold text-gray-900 mt-2">15</p>
                <div className="mt-2 text-sm text-gray-600">
                  Active this semester
                </div>
              </div>
            </div>
          </div>
        );
      case 'students':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Students List
              </h3>
            </div>
            <div className="p-6">
              {data.students.length ? (
                <div className="overflow-x-auto">
                  {/* your table logic here */}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No students found
                </p>
              )}
            </div>
          </div>
        );
      case 'teachers':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Teachers List
              </h3>
            </div>
            <div className="p-6">
              {data.teachers.length ? (
                <div className="overflow-x-auto">
                  {/* your table logic here */}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No teachers found
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="h-full w-full bg-gray-50">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors duration-200">
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {school.name}
            </h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`group flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-all duration-200
                    ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}>
                  <tab.icon
                    className={`h-5 w-5 transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'text-indigo-600'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
