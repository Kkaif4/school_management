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
  IdCard,
  FileText,
} from 'lucide-react';
import { Student } from '@/types/student';
import api from '@/lib/api';
import StudentDetailFooter from './StudentDetailFooter';

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

  return (
    <>
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-xs z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white flex-shrink-0">
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
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Section
                title="Personal Information"
                icon={<User className="h-5 w-5 text-indigo-600" />}>
                <Info label="First Name" value={student.firstName} />
                {student.middleName && (
                  <Info label="Middle Name" value={student.middleName} />
                )}
                <Info label="Last Name" value={student.lastName} />
                <Info
                  label="Date of Birth"
                  value={formatDate(student.dateOfBirth)}
                />
                <Info label="Birth Place" value={student.birthPlace} />
                <Info label="Gender" value={student.gender} />
                <Info label="Nationality" value={student.nationality} />
              </Section>

              {/* Academic Information */}
              <Section
                title="Academic Information"
                icon={<Book className="h-5 w-5 text-purple-600" />}>
                <Info label="Student ID" value={student.studentId} />
                <Info label="Register Number" value={student.registerNumber} />
                <Info label="Roll Number" value={student.rollNumber} />
                <Info label="Grade" value={`Grade ${student.grade}`} />
                <Info label="Division" value={`Division ${student.division}`} />
                <Info
                  label="Admission Date"
                  value={formatDate(student.admissionDate)}
                />
                {student.previousSchoolName && (
                  <Info
                    label="Previous School"
                    value={student.previousSchoolName}
                  />
                )}
              </Section>

              {/* Family Information */}
              <Section
                title="Family Information"
                icon={<Users className="h-5 w-5 text-green-600" />}>
                <Info label="Father's Name" value={student.fatherName} />
                <Info label="Mother's Name" value={student.motherName} />
              </Section>

              {/* Identification & Religion */}
              <Section
                title="Identity & Background"
                icon={<IdCard className="h-5 w-5 text-orange-600" />}>
                <Info label="Aadhaar" value={student.adhaar} />
                <Info label="Caste" value={student.cast} />
                <Info label="Religion" value={student.religion} />
              </Section>

              {/* Contact Information */}
              <Section
                title="Contact Information"
                icon={<Phone className="h-5 w-5 text-blue-600" />}>
                <Info label="Phone" value={student.contactNumber} />
                <Info label="Address" value={student.address} multiline />
              </Section>

              {/* Custom Fields */}
              {student.customFields && student.customFields.length > 0 && (
                <Section
                  title="Additional Information"
                  icon={<FileText className="h-5 w-5 text-gray-600" />}>
                  {student.customFields.map((field, idx) => (
                    <Info key={idx} label={field.key} value={field.value} />
                  ))}
                </Section>
              )}
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3 flex-shrink-0">
              <StudentDetailFooter student={student} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Helpers ---------- */
function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Info({
  label,
  value,
  multiline,
}: {
  label: string;
  value: any;
  multiline?: boolean;
}) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-gray-600">{label}:</span>
      <span
        className={`font-medium text-gray-900 ${
          multiline ? 'text-right max-w-xs' : ''
        }`}>
        {value || '—'}
      </span>
    </div>
  );
}
