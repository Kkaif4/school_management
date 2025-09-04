'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Student } from '@/types/student';
import api, { studentAPI } from '@/lib/api';
import StudentsHeader from './StudentsHeader';
import StudentsFilters from './StudentsFilters';
import StudentsList from './StudentsList';
import EmptyState from './EmptyState';
import AddStudentModal from './AddStudentModal';
import StudentDetails from './StudentsDetails';

interface StudentsProps {
  schoolId: string;
  isTeacherView?: boolean;
}

export default function Students({
  schoolId,
  isTeacherView = false,
}: StudentsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [Loading, setIsLoading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStudents = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await studentAPI.getStudent(schoolId);
      console.log('Fetched students');
      setStudents(response.data.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setStudents([]);
      } else {
        console.log('Error fetching students:', err.message);
        setError(err.message || 'Failed to fetch students');
      }
    }
    setIsLoading(false);
  }, [schoolId]);

  const onRefresh = () => {
    fetchStudents();
  };

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
    formData.append('schoolId', schoolId);

    try {
      const response = await studentAPI.uploadCSV(formData);
      alert(
        `${
          response.data.summary.saved || 'Some'
        } students uploaded successfully!`
      );
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          'Failed to upload students. Please check CSV format.'
      );
    }

    event.target.value = '';
  };

  if (Loading) {
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
            filteredStudents={filteredStudents}
            onStudentClick={handleStudentClick}
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
          fetchStudents();
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
