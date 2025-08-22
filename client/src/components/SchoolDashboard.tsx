'use client';

import { useState } from 'react';
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
                  {data?.students?.length || 0}
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
                  {data?.teachers?.length || 0}
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
              <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200">
                Add Student
              </button>
            </div>
            <div className="p-6">
              {data?.students?.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.students.map((student) => (
                        <tr key={student._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {student.grade}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.contactNumber || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
              <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200">
                Add Teacher
              </button>
            </div>
            <div className="p-6">
              {data?.teachers?.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.teachers.map((teacher) => (
                        <tr key={teacher._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {teacher.firstName} {teacher.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {teacher.subject || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {teacher.contactNumber || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
    <div
      className="fixed inset-0 z-50 transform transition-opacity duration-300 ease-in-out"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}>
      <div
        className="fixed inset-0 transform transition-transform duration-500 ease-in-out"
        style={{
          animation: 'fadeIn 0.3s ease-out',
        }}>
        <div className="h-full w-full bg-gray-50">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
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
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      group flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-all duration-200
                      ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}>
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
            <div className="transform transition-all duration-500 ease-in-out">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
