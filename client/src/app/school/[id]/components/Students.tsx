'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { Student, getStudents } from '@/api/students';
import { api } from '@/api/axios';
import Pagination from '@/components/common/Pagination';
import StudentsHeader from './StudentsHeader';
import StudentsFilters from './StudentsFilters';
import StudentsList from './StudentsList';
import EmptyState from './EmptyState';
import AddStudentModal from './AddStudentModal';
import StudentDetails from './StudentDetails';

interface StudentsProps {
  schoolId: string;
  students: Student[];
  error: string | null;
  loading: boolean;
  onRefresh: () => void;
}

export default function Students({
  schoolId,
  students,
  error,
  loading,
  onRefresh,
}: StudentsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Get current students for pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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

  // Trigger file input on "Upload CSV"
  const handleUploadCSVClick = () => {
    fileInputRef.current?.click();
  };

  // Handle CSV file selection
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('schoolId', schoolId); // send schoolId

    try {
      const response = await api.post('/student/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(`${response.data.saved || 'Some'} students uploaded successfully!`);
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(
        error.response?.data?.message ||
          'Failed to upload students. Please check CSV format.'
      );
    }

    event.target.value = '';
  };

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
          <p className="font-medium">Error loading students</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <StudentsHeader
        onAddStudent={() => setIsFormOpen(true)}
        onUploadCSV={handleUploadCSVClick}
      />

      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <StudentsFilters
        searchTerm={searchTerm}
        selectedGrade={selectedGrade}
        selectedDivision={selectedDivision}
        onSearchChange={setSearchTerm}
        onGradeChange={setSelectedGrade}
        onDivisionChange={setSelectedDivision}
        onClearFilters={handleClearFilters}
      />

      {filteredStudents.length > 0 ? (
        <>
          <StudentsList
            students={students}
            filteredStudents={currentStudents}
            onStudentClick={handleStudentClick}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <EmptyState
          hasStudents={students.length > 0}
          onAddStudent={() => setIsFormOpen(true)}
        />
      )}

      <AddStudentModal
        isOpen={isFormOpen}
        schoolId={schoolId}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setIsFormOpen(false);
          onRefresh();
          setCurrentPage(1); // Reset to first page after adding new student
        }}
        onCancel={() => setIsFormOpen(false)}
      />

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
