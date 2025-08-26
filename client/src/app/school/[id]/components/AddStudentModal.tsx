import { X } from "lucide-react";
import AddStudentForm from "./studentForm";

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
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Add New Student
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <AddStudentForm
          schoolId={schoolId}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}