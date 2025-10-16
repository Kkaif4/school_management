import { Plus } from 'lucide-react';
import React from 'react';

interface EmptyStateProps {
  /** Whether there are items already (used to toggle message vs. filter state) */
  hasData: boolean;
  /** The entity name, e.g., "student", "teacher", "course" */
  entityName: string;
  /** Icon component for the entity */
  icon: React.ReactNode;
  /** Callback when add button is clicked */
  onAdd: () => void;
}

export default function EmptyState({
  hasData,
  entityName,
  icon,
  onAdd,
}: EmptyStateProps) {
  const capitalizedEntity =
    entityName.charAt(0).toUpperCase() + entityName.slice(1);

  return (
    <div className="text-center py-10 sm:py-12 px-4 border border-dashed border-gray-300 rounded-xl">
      <div className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">
        {!hasData
          ? `No ${entityName}s found`
          : `No ${entityName}s match your filters`}
      </h3>
      <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4 max-w-sm mx-auto">
        {!hasData
          ? `Get started by adding your first ${entityName}.`
          : "Try adjusting your search or filters to find what you're looking for."}
      </p>
      {!hasData && (
        <button
          onClick={onAdd}
          className="bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5 sm:gap-2">
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          Add {capitalizedEntity}
        </button>
      )}
    </div>
  );
}
