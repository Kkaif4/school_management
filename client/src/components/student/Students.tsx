import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useSchoolStore } from '@/stores/schoolStore';
import { Student } from '@/types/student';
import { studentAPI } from '@/lib/api';
import StudentsHeader from './StudentsHeader';
import StudentsFilters from './StudentsFilters';
import StudentsList from './StudentsList';
import EmptyState from './EmptyState';
import AddStudentModal from './AddStudentModal';
import StudentDetails from './StudentsDetails';
import AddStudentForm from './StudentForm';

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
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStudents = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await studentAPI.getStudent(schoolId);
      setStudents(response.data.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setStudents([]);
      } else {
        setError(err.message || 'Failed to fetch students');
      }
    }
    setLoading(false);
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
    setSelectedStudent(null);
  };

  const handleUploadCSVClick = () => {
    fileInputRef.current?.click();
  };

  const onStudentDelete = async (studentId: string) => {
    try {
      await studentAPI.deleteStudent(studentId);
      alert('Student deleted successfully');
      fetchStudents();
    } catch (err: any) {
      console.log(err);
      alert('Failed to delete student.');
    }
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('schoolId', schoolId);

    try {
      const response = await studentAPI.uploadCSV(formData);
      alert(
        `${
          response.data.summary.saved || 'Some'
        } students uploaded successfully!`
      );
      fetchStudents(); // refresh list
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          'Failed to upload students. Please check CSV format.'
      );
    }

    event.target.value = '';
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

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <StudentsHeader
        onAddStudent={() => setIsFormOpen(true)}
        onUploadCSV={handleUploadCSVClick}
      />

      {/* Hidden CSV input */}
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Filters */}
      <div className="mt-4 sm:mt-6">
        <StudentsFilters
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
        {filteredStudents.length > 0 ? (
          <StudentsList
            students={students}
            filteredStudents={filteredStudents}
            onStudentClick={handleStudentClick}
          />
        ) : (
          <EmptyState
            hasStudents={students.length > 0}
            onAddStudent={() => setIsFormOpen(true)}
          />
        )}
      </div>

      {/* Add Student Modal */}
      {isFormOpen && school && (
        <AddStudentModal
          isOpen={isFormOpen}
          schoolId={school._id}
          onSuccess={fetchStudents}
          onCancel={() => setIsFormOpen(false)}
          onClose={() => setIsFormOpen(false)}>
          <>
            <AddStudentForm
              schoolId={school._id}
              customField={school.studentFields || []}
              onSuccess={() => {
                fetchStudents();
                setIsFormOpen(false);
              }}
              onCancel={() => setIsFormOpen(false)}
            />
          </>
        </AddStudentModal>
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}
