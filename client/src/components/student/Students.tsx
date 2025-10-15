import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSchoolStore } from '@/stores/schoolStore';
import { Student } from '@/types/student';
import { studentAPI } from '@/lib/api';
import Filters from '../common/Filters';
import EmptyState from '../common/EmptyState';
import AddStudentModal from './AddStudentModal';
import StudentDetails from './StudentsDetails';
import { DataTable } from '../common/dataTable';
import { Eye, Plus, Trash2, Upload, Users } from 'lucide-react';
import WarningModal from '../ui/warning';
import EntityHeader from '../common/CommonHeader';
import { toast } from '@/components/ui/sonner';
interface StudentsProps {
  schoolId: string;
}

export default function Students({ schoolId }: StudentsProps) {
  const { school } = useSchoolStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const fetchStudents = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await studentAPI.getStudents(schoolId);
      setStudents(response.data.data);
      toast('Students fetched successfully');
    } catch (err) {
      if (err) {
        setStudents([]);
        toast.error('No students found');
      } else {
        toast.error(err.message);
        setError(err.message || 'Failed to fetch students');
      }
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${student.rollNumber}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesGrade =
        selectedGrade === 'all' || student.grade === Number(selectedGrade);
      const matchesDivision =
        selectedDivision === 'all' || student.division === selectedDivision;

      return matchesSearch && matchesGrade && matchesDivision;
    });
  }, [students, searchTerm, selectedGrade, selectedDivision]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGrade('all');
    setSelectedDivision('all');
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowDeleteWarning(true);
  };

  const confirmDelete = async () => {
    if (!selectedStudent?._id) return;

    try {
      const res = await studentAPI.deleteStudent(selectedStudent._id);
      toast(res.data.message);
      fetchStudents();
      setShowDeleteWarning(false);
      setSelectedStudent(null);
    } catch (error) {
      if (error) {
        toast(error.response?.data?.message || 'Failed to delete student');
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
          <p className="font-medium">Error loading students</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const getHeaderActions = () => [
    {
      label: 'Upload CSV',
      icon: Upload,
      isFileUpload: true,
      accept: '.csv',
      variant: 'secondary' as const,

      onFileSelect: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('schoolId', schoolId);

        try {
          const response = await studentAPI.uploadCSV(formData);
          toast(response.data.message);
          fetchStudents();
        } catch (error) {
          if (error) {
            toast.error(
              error.response?.data?.message || 'Failed to upload CSV'
            );
          }
        }
      },
    },
    {
      label: 'Add Student',
      icon: Plus,
      variant: 'primary' as const,
      onClick: () => setIsFormOpen(true),
    },
  ];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <EntityHeader
        title="Students"
        description="Manage student enrollment and information"
        icon={Users}
        actions={getHeaderActions()}
      />

      {/* Filters */}
      <div className="mt-4 sm:mt-6">
        <Filters
          searchTerm={searchTerm}
          selectedGrade={selectedGrade}
          selectedDivision={selectedDivision}
          onSearchChange={setSearchTerm}
          onGradeChange={setSelectedGrade}
          onDivisionChange={setSelectedDivision}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Student List or Empty State */}
      <div className="mt-4 sm:mt-6">
        <DataTable
          data={filteredStudents}
          actions={[
            {
              label: 'Details',
              icon: <Eye />,
              onClick: handleStudentClick,
            },
            {
              label: 'Delete',
              icon: <Trash2 />,
              variant: 'destructive',
              onClick: handleDeleteStudent,
            },
          ]}
          loading={loading}
          emptyState={
            <EmptyState
              hasData={students.length > 0}
              entityName="student"
              icon={<Users className="h-full w-full" />}
              onAdd={() => setIsFormOpen(true)}
            />
          }
        />
      </div>

      {/* Add Student Modal */}
      {isFormOpen && school && (
        <AddStudentModal
          isOpen={isFormOpen}
          schoolId={school._id}
          onSuccess={fetchStudents}
          onCancel={() => setIsFormOpen(false)}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
        />
      )}

      {/* Delete Warning Modal */}
      <WarningModal
        isOpen={showDeleteWarning}
        onClose={() => {
          setShowDeleteWarning(false);
          setSelectedStudent(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${selectedStudent?.firstName} ${selectedStudent?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
