import { useState } from 'react';
import api, { certificateAPI } from '@/lib/api';
import { X } from 'lucide-react';

interface CertificateFormProps {
  schoolId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CertificateForm({
  schoolId,
  onClose,
  onSuccess,
}: CertificateFormProps) {
  const [title, setTitle] = useState('');
  const [templateCode, setTemplateCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !templateCode.trim()) {
      setError('Please provide both title and ZPL code.');
      return;
    }

    try {
      setLoading(true);
      const response = await certificateAPI.createCertificate({
        schoolId,
        name: title,
        templateCode,
      });
      if (!response.data.success) {
        setError(response.data.message);
        return;
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('Error saving certificate:', err);
      setError(err.message || 'Failed to save certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 sm:p-6"
      aria-modal="true"
      role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl p-4 sm:p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Add Certificate</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition"
            aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="certificateTitle"
              className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Certificate Title
            </label>
            <input
              id="certificateTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g., Transfer Certificate"
            />
          </div>

          <div>
            <label
              htmlFor="zplCode"
              className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              ZPL Code
            </label>
            <textarea
              id="zplCode"
              value={templateCode}
              onChange={(e) => setTemplateCode(e.target.value)}
              rows={6}
              className="w-full border rounded-lg px-3 py-2 sm:px-4 sm:py-2 font-mono text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="^XA ... ^XZ"
            />
          </div>

          {error && (
            <p className="text-sm sm:text-base text-red-600">{error}</p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100 w-full sm:w-auto">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 w-full sm:w-auto">
              {loading ? 'Saving...' : 'Save Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
