'use client';

import {
  X,
  User,
  Phone,
  Book,
  Users,
  Printer,
  Edit,
  Trash,
} from 'lucide-react';
import { Student } from '@/api/students';

interface StudentDetailsProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentDetails({
  student,
  isOpen,
  onClose,
}: StudentDetailsProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const handleDelete = () => {};
  const handlePrint = () => {
    const printContent = document.getElementById('student-details-print');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.body.innerHTML = `
          <html>
            <head>
              <title>Student Details - ${student.firstName} ${student.lastName}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; }
                .student-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; color: #4f46e5; }
                .student-info { color: #666; }
                .section { margin-bottom: 25px; }
                .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #374151; border-left: 4px solid #4f46e5; padding-left: 12px; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                .info-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
                .label { font-weight: 600; color: #6b7280; }
                .value { color: #111827; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `;
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {student.firstName}{' '}
                      {student.middleName ? `${student.middleName} ` : ''}
                      {student.lastName}
                    </h2>
                    <p className="text-indigo-100">Student Details</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Print Student Details">
                    <Printer className="h-5 w-5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Print Content - Hidden but used for printing */}
              <div id="student-details-print" className="hidden print:block">
                <div className="header">
                  <div className="student-name">
                    {student.firstName}{' '}
                    {student.middleName ? `${student.middleName} ` : ''}
                    {student.lastName}
                  </div>
                  <div className="student-info">Student Details Report</div>
                </div>

                <div className="section">
                  <div className="section-title">Personal Information</div>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">First Name:</span>
                      <span className="value">{student.firstName}</span>
                    </div>
                    {student.middleName && (
                      <div className="info-item">
                        <span className="label">Middle Name:</span>
                        <span className="value">{student.middleName}</span>
                      </div>
                    )}
                    <div className="info-item">
                      <span className="label">Last Name:</span>
                      <span className="value">{student.lastName}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Date of Birth:</span>
                      <span className="value">
                        {formatDate(student.dateOfBirth)}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Gender:</span>
                      <span className="value">
                        {student.gender || 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="section">
                  <div className="section-title">Academic Information</div>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Roll Number:</span>
                      <span className="value">{student.rollNumber}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Grade:</span>
                      <span className="value">Grade {student.grade}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Division:</span>
                      <span className="value">Division {student.division}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Student ID:</span>
                      <span className="value">{student._id}</span>
                    </div>
                  </div>
                </div>

                <div className="section">
                  <div className="section-title">Family Information</div>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Father's Name:</span>
                      <span className="value">{student.fatherName}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Mother's Name:</span>
                      <span className="value">{student.motherName}</span>
                    </div>
                  </div>
                </div>

                <div className="section">
                  <div className="section-title">Contact Information</div>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Phone:</span>
                      <span className="value">{student.contactNumber}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Address:</span>
                      <span className="value">{student.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-indigo-600" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">First Name:</span>
                      <span className="font-medium text-gray-900">
                        {student.firstName}
                      </span>
                    </div>
                    {student.middleName && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Middle Name:</span>
                        <span className="font-medium text-gray-900">
                          {student.middleName}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Name:</span>
                      <span className="font-medium text-gray-900">
                        {student.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(student.dateOfBirth)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {student.gender || 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Book className="h-5 w-5 text-purple-600" />
                    Academic Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Roll Number:</span>
                      <span className="font-medium text-gray-900">
                        {student.rollNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grade:</span>
                      <span className="font-medium text-gray-900">
                        Grade {student.grade}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Division:</span>
                      <span className="font-medium text-gray-900">
                        Division {student.division}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Student ID:</span>
                      <span className="font-medium text-gray-900 text-xs">
                        {student._id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Family Information */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Family Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Father's Name:</span>
                      <span className="font-medium text-gray-900">
                        {student.fatherName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mother's Name:</span>
                      <span className="font-medium text-gray-900">
                        {student.motherName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium text-gray-900">
                        {student.contactNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium text-gray-900 text-right max-w-xs">
                        {student.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handlePrint}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Print Document
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  onClick={() => {
                    console.log('Edit student:', student._id);
                  }}>
                  <Edit className="h-4 w-4" />
                  Edit Student
                </button>
                <button
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2"
                  onClick={() => {
                    handleDelete;
                  }}>
                  <Trash className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
