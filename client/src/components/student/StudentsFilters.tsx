import { Search, Filter, Hash, X } from 'lucide-react';
import { Divisions } from '@/types/student';
interface StudentsFiltersProps {
  searchTerm: string;
  selectedGrade: string;
  selectedDivision: string;
  onSearchChange: (term: string) => void;
  onGradeChange: (grade: string) => void;
  onDivisionChange: (division: string) => void;
  onClearFilters: () => void;
}

export default function StudentsFilters({
  searchTerm,
  selectedGrade,
  selectedDivision,
  onSearchChange,
  onGradeChange,
  onDivisionChange,
  onClearFilters,
}: StudentsFiltersProps) {
  const hasActiveFilters =
    searchTerm || selectedGrade !== 'all' || selectedDivision !== 'all';

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
      <div className="flex flex-wrap gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[140px] max-w-[200px] sm:max-w-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
          />
        </div>

        {/* Grade Filter */}
        <div className="relative flex-1 min-w-[120px] max-w-[160px] sm:max-w-none">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <select
            value={selectedGrade}
            onChange={(e) => onGradeChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 bg-white">
            <option value="all">All</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>

        {/* Division Filter */}
        <div className="relative flex-1 min-w-[120px] max-w-[160px] sm:max-w-none">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <select
            value={selectedDivision}
            onChange={(e) => onDivisionChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 bg-white">
            <option value="all">All</option>
            {Divisions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-700">
            Active filters:
          </span>

          {searchTerm && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {searchTerm}
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 rounded-full text-blue-600 hover:text-blue-800">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedGrade !== 'all' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Grade {selectedGrade}
              <button
                onClick={() => onGradeChange('all')}
                className="ml-1 rounded-full text-purple-600 hover:text-purple-800">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {selectedDivision !== 'all' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Div {selectedDivision}
              <button
                onClick={() => onDivisionChange('all')}
                className="ml-1 rounded-full text-green-600 hover:text-green-800">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            onClick={onClearFilters}
            className="text-xs sm:text-sm text-indigo-700 hover:text-indigo-900 font-medium">
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
