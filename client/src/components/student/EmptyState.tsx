import { Users, Plus } from 'lucide-react';

interface EmptyStateProps {
  hasStudents: boolean;
  onAddStudent: () => void;
}

export default function EmptyState({
  hasStudents,
  onAddStudent,
}: EmptyStateProps) {
  return (
    <div className="text-center py-10 sm:py-12 px-4 border border-dashed border-gray-300 rounded-xl">
      <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">
        {!hasStudents
          ? 'No students enrolled'
          : 'No students match your filters'}
      </h3>
      <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4 max-w-sm mx-auto">
        {!hasStudents
          ? 'Get started by adding your first student.'
          : "Try adjusting your search or filters to find what you're looking for."}
      </p>
      {!hasStudents && (
        <button
          onClick={onAddStudent}
          className="bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5 sm:gap-2">
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          Add Student
        </button>
      )}
    </div>
  );
}
