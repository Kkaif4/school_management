import { UserPlus, X } from 'lucide-react';
import AddStudentForm from './studentForm';

interface AddStudentModalProps {
  isOpen: boolean;
  schoolId: string;
  onClose: () => void;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddStudentModal({
  isOpen,
  schoolId,
  onClose,
  onSuccess,
  onCancel,
}: AddStudentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header with gradient */}
        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-xl px-6 py-4">
          <div className="flex items-center space-x-3">
            {/* Avatar/Icon */}
            <div className="bg-white/20 p-2 rounded-lg"></div>
            <div>
              <UserPlus className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Add New Student</h3>
              <p className="text-sm text-white/80">Student Details</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="hover:text-gray-200 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <AddStudentForm
            schoolId={schoolId}
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  );
}
