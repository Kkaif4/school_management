import { UserPlus, X } from 'lucide-react';
import AddStudentForm from './StudentForm';
import { useSchoolStore } from '@/stores/schoolStore';

interface AddStudentModalProps {
  isOpen: boolean;
  schoolId: string;
  onClose: () => void;
  onSuccess: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export default function AddStudentModal({
  isOpen,
  schoolId,
  onClose,
  onSuccess,
  onCancel,
}: AddStudentModalProps) {
  const { school } = useSchoolStore();
  if (!isOpen) return null;

  if (!school) return <p className="text-red-500">No school selected</p>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-xl px-4 sm:px-6 py-3 gap-2">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg hidden sm:block">
              <UserPlus className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold">
                Add New Student
              </h3>
              <p className="text-xs sm:text-sm text-white/80">
                Student Details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="self-end sm:self-auto hover:text-gray-200">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <AddStudentForm
            schoolId={schoolId}
            customField={school.studentFields || []}
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  );
}
