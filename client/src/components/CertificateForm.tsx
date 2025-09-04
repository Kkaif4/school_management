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
  const [templateCode, settemplateCode] = useState('');
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
      console.log('sending request to create certificate', {
        schoolId,
        name: title,
        templateCode,
      });
      const response = await certificateAPI.createCertificate({
        schoolId,
        name: title,
        templateCode,
      });
      if (!response.data.success) {
        setError(response.data.message);
        return;
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.log('Error saving certificate:', err.message);
      setError(err.message || 'Failed to save certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[600px] p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Certificate</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certificate Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g., Transfer Certificate"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZPL Code
            </label>
            <textarea
              value={templateCode}
              onChange={(e) => settemplateCode(e.target.value)}
              rows={8}
              className="w-full border rounded-lg px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="^XA ... ^XZ"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
