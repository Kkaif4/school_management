"use client";

import { useState, useMemo } from "react";
import { Teacher } from "@/api/teachers";
import AddTeacherForm from "./teacherForm";
import { Search, Plus, X, Users, Mail } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");

  // Filter teachers based on search
  const filteredTeachers = useMemo(() => {
    return teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.email &&
          teacher.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [teachers, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="font-medium">Error loading teachers</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600" />
            Teaching Staff
          </h2>
          <p className="text-gray-500 mt-1">
            Manage faculty information and assignments
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add Teacher
        </button>
      </div>

      {/* Search Section */}
      <div className="bg-white-50 p-4 rounded-lg mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
          <input
            type="text"
            placeholder="Search teachers by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Active Search */}
        {searchTerm && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">Search results for:</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {searchTerm}
              <button
                onClick={() => setSearchTerm("")}
                className="ml-1.5 rounded-full flex-shrink-0 flex items-center justify-center text-blue-400 hover:text-blue-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Teachers List */}
      {filteredTeachers.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-700">
              Showing {filteredTeachers.length} of {teachers.length} teachers
            </p>
          </div>
          <ul className="divide-y divide-gray-200">
            {filteredTeachers.map((teacher) => (
              <li
                key={teacher._id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-100 p-3 rounded-full flex-shrink-0">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {teacher.name}
                      </h3>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {teacher.email && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span>{teacher.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <div className="flex gap-2">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium px-3 py-1.5 bg-indigo-50 rounded-md">
                      View Details
                    </button>
                    
                  </div> */}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {teachers.length === 0
              ? "No teachers registered"
              : "No teachers match your search"}
          </h3>
          <p className="text-gray-500 mb-4">
            {teachers.length === 0
              ? "Get started by adding your first teacher."
              : "Try adjusting your search to find what you're looking for."}
          </p>
          {teachers.length === 0 && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Teacher
            </button>
          )}
        </div>
      )}

      {/* Add Teacher Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Add New Teacher
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

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
