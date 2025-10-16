import { X, User, FileText } from 'lucide-react';
import { Student } from '@/types/student';
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

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? '—'
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-white flex-shrink-0 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                {' '}
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    {student.firstName}{' '}
                    {student.middleName ? `${student.middleName} ` : ''}
                    {student.lastName}
                  </h2>
                  <p className="text-indigo-100 text-sm">Student Details</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Content Body */}
            <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5">
              {' '}
              <div className="flex flex-col gap-5">
                {/* Student Information */}
                <Section
                  title="Student Information"
                  icon={<User className="h-5 w-5 text-indigo-600" />}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                    <Info label="Student ID" value={student.studentId} />
                    <Info
                      label="Register Number"
                      value={student.registrationNumber}
                    />
                    <Info label="First Name" value={student.firstName} />
                    {student.middleName && (
                      <Info label="Middle Name" value={student.middleName} />
                    )}
                    <Info label="Last Name" value={student.lastName} />
                    <Info
                      label="Date of Birth"
                      value={formatDate(student.dateOfBirth)}
                    />
                    <Info label="Gender" value={student.gender} />
                    <Info label="Grade" value={student.grade} />
                    <Info label="Division" value={student.division} />
                    <Info label="Roll Number" value={student.rollNumber} />
                  </div>
                </Section>
              </div>
              <div className="flex flex-col gap-5">
                {/* Custom Fields */}
                {student.customFields &&
                  Object.keys(student.customFields).length > 0 && (
                    <Section
                      title="Additional Information"
                      icon={<FileText className="h-5 w-5 text-gray-600" />}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                        {Object.entries(student.customFields).map(
                          ([key, value], idx) => (
                            <Info
                              key={idx}
                              label={key}
                              value={formatInfoValue(value)}
                            />
                          )
                        )}
                      </div>
                    </Section>
                  )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-end flex-shrink-0 rounded-b-xl">
              <StudentDetailFooter student={student} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-gray-50/70 rounded-xl p-4 sm:p-5 ${className || ''}`}>
      <h3 className="text-md sm:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}

function formatInfoValue(value: unknown): string {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'object' && value !== null && 'value' in value) {
    const val = (value as { value: string }).value;
    return val || '—';
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return value.toString() || '—';
  }

  return '—';
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | boolean | number;
}) {
  return (
    <div className="flex items-start text-sm">
      <span className="w-2/5 text-gray-500">{label}:</span>
      <span className="w-3/5 font-medium text-gray-800 break-words">
        {value || '—'}
      </span>
    </div>
  );
}
