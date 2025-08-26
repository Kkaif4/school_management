'use client';

import { useState, useMemo } from 'react';
import { Student } from '@/api/students';
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
}

export default function Students({
  schoolId,
  students,
  error,
  loading,
}: StudentsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter students based on search and filters
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGrade =
        selectedGrade === 'all' || student.grade === selectedGrade;
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
        onUploadCSV={() => {}}
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

      <AddStudentModal
        isOpen={isFormOpen}
        schoolId={schoolId}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setIsFormOpen(false);
          // You might want to refresh the student list here
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
