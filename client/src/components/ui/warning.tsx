import { X } from 'lucide-react';
import { Button } from './button';

interface WarningModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function WarningModal({
  isOpen,
  message,
  onClose,
  onConfirm,
  title = 'Warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
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
            <X className="h-4 w-4" />
          </button>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

          {/* Message */}
          <p className="text-gray-600 mb-6">{message}</p>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              {cancelText}
            </Button>
            {onConfirm && (
              <Button
                variant="destructive"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}>
                {confirmText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
