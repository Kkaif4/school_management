import { X } from 'lucide-react';

interface WarningModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function WarningModal({
  isOpen,
  message,
  onClose,
}: WarningModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 hover:bg-gray-200 rounded-full transition-colors">
            <X className="h-4 w-4 text-gray-600" />
          </button>

          {/* Message */}
          <div className="text-center">
            <p className="text-gray-800 text-lg">{message}</p>
          </div>

          {/* OK Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
