'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Teacher } from '@/types/teacher';
import { teacherAPI } from '@/lib/api';
import { DataTable } from '../common/dataTable';
import { Eye, Plus, Trash2, Upload, Users } from 'lucide-react';
import WarningModal from '../ui/warning';
import EmptyState from '../common/EmptyState';
import AddTeacherModal from './AddTeacherModel';
import EntityHeader from '../common/CommonHeader';
import { toast } from '@/hooks/use-toast';
import Filters from '../common/Filters';
import TeacherDetails from './TeacherDetails';

interface TeachersProps {
  schoolId: string;
}

export default function Teachers({ schoolId }: TeachersProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  // Fetch teachers
  const fetchTeachers = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await teacherAPI.getTeachers(schoolId);
      setTeachers(response.data.data || response.data);
    } catch (err) {
      if (err) {
        if (err.response?.status === 404) {
          setTeachers([]);
        } else {
          setError(err.message || 'Failed to fetch teachers');
        }
      }
    }
    setLoading(false);
  }, [schoolId]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // Filtering
  const filteredTeachers = useMemo(() => {
    return teachers.filter(
      (teacher) =>
        teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teachers, searchTerm]);

  // Delete logic
  const handleDeleteTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowDeleteWarning(true);
  };

  const handleTeacherClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDetailsOpen(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  const confirmDelete = async () => {
    if (!selectedTeacher?._id) return;
    try {
      await teacherAPI.deleteTeacher(selectedTeacher._id);
      fetchTeachers();
      setShowDeleteWarning(false);
      setSelectedTeacher(null);
    } catch (error) {
      if (error) {
        toast(error.response?.data?.message || 'Failed to delete teacher');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-200 max-w-md text-center">
          <p className="font-medium">Error loading teachers</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const getHeaderActions = () => [
    {
      label: 'Add Teacher',
      icon: Plus,
      variant: 'primary' as const,
      onClick: () => setIsFormOpen(true),
    },
  ];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <EntityHeader
        title="Teachers"
        description="Manage teacher information"
        icon={Users}
        actions={getHeaderActions()}
      />

      <div className="mt-4 sm:mt-6">
        <Filters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Teachers List or Empty State */}
      <DataTable
        data={filteredTeachers}
        actions={[
          {
            label: 'Details',
            icon: <Eye />,
            onClick: handleTeacherClick,
          },
          {
            label: 'Delete',
            icon: <Trash2 />,
            variant: 'destructive',
            onClick: handleDeleteTeacher,
          },
        ]}
        loading={loading}
        emptyState={
          <EmptyState
            hasData={teachers.length > 0}
            entityName="teacher"
            icon={<Users className="h-full w-full" />}
            onAdd={() => setIsFormOpen(true)}
          />
        }
      />

      {selectedTeacher && (
        <TeacherDetails
          teacher={selectedTeacher}
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
        />
      )}

      {/* Add Teacher Modal */}
      <AddTeacherModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        schoolId={schoolId}
        onSuccess={() => {
          setIsFormOpen(false);
          fetchTeachers();
        }}
        onCancel={() => setIsFormOpen(false)}
      />

      {/* Delete Warning Modal */}
      <WarningModal
        isOpen={showDeleteWarning}
        onClose={() => {
          setShowDeleteWarning(false);
          setSelectedTeacher(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Teacher"
        message={`Are you sure you want to delete ${selectedTeacher?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
