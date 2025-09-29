import { X, User, FileText } from 'lucide-react';
import type { Teacher } from '@/types/teacher';

interface TeacherDetailsProps {
  teacher: Teacher;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeacherDetails({
  teacher,
  isOpen,
  onClose,
}: TeacherDetailsProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-white flex-shrink-0 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{teacher.name}</h2>
                  <p className="text-indigo-100 text-sm">Teacher Details</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Content Body */}
            <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 gap-5">
              <Section
                title="Teacher Information"
                icon={<User className="h-5 w-5 text-indigo-600" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  <Info label="Name" value={teacher.name} />
                  <Info label="Email" value={teacher.email} />
                  <Info label="Role" value={teacher.role} />
                  <Info
                    label="Active"
                    value={
                      teacher.isActive ? (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full 
                              bg-green-100 text-green-800`}>
                          Active
                        </span>
                      ) : (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full 
                            bg-red-100 text-red-800`}>
                          Inactive
                        </span>
                      )
                    }
                  />
                  {/* <Info
                    label="Created At"
                    value={formatDate(teacher.createdAt)}
                  />
                  <Info
                    label="Updated At"
                    value={formatDate(teacher.updatedAt)}
                  /> */}
                </div>
              </Section>
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

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start text-sm">
      <span className="w-2/5 text-gray-500">{label}:</span>
      <span className="w-3/5 font-medium text-gray-800 break-words">
        {value || '—'}
      </span>
    </div>
  );
}
