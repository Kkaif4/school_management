import { Users, Plus, Upload } from 'lucide-react';

interface StudentsHeaderProps {
  onAddStudent: () => void;
  onUploadCSV: () => void;
}

export default function StudentsHeader({
  onAddStudent,
  onUploadCSV,
}: StudentsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      {/* Title + Subtitle */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="h-6 w-6 text-indigo-600" />
          Students
        </h2>
        <p className="text-gray-500 mt-1">
          Manage student enrollment and information
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onUploadCSV}
          className="bg-gray-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md">
          <Upload className="h-4 w-4" />
          Upload CSV
        </button>
        <button
          onClick={onAddStudent}
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md">
          <Plus className="h-4 w-4" />
          Add Student
        </button>
      </div>
    </div>
  );
}
