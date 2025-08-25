import { Search, Filter, Hash, X } from "lucide-react";

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
  const hasActiveFilters = searchTerm || selectedGrade !== "all" || selectedDivision !== "all";

  return (
    <div className="bg-white p-4 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Grade Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Hash className="h-4 w-4 text-gray-500" />
          </div>
          <select
            value={selectedGrade}
            onChange={(e) => onGradeChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 appearance-none bg-white text-gray-900"
          >
            <option value="all">All Grades</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
              <option key={grade} value={grade.toString()}>
                Grade {grade}
              </option>
            ))}
          </select>
        </div>

        {/* Division Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Filter className="h-4 w-4 text-gray-500" />
          </div>
          <select
            value={selectedDivision}
            onChange={(e) => onDivisionChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 appearance-none bg-white text-gray-900"
          >
            <option value="all">All Divisions</option>
            {["A", "B", "C", "D", "E"].map((division) => (
              <option key={division} value={division}>
                Division {division}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-700">Active filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Search: {searchTerm}
              <button
                onClick={() => onSearchChange("")}
                className="ml-1.5 rounded-full flex-shrink-0 flex items-center justify-center text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedGrade !== "all" && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Grade: {selectedGrade}
              <button
                onClick={() => onGradeChange("all")}
                className="ml-1.5 rounded-full flex-shrink-0 flex items-center justify-center text-purple-600 hover:text-purple-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedDivision !== "all" && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Division: {selectedDivision}
              <button
                onClick={() => onDivisionChange("all")}
                className="ml-1.5 rounded-full flex-shrink-0 flex items-center justify-center text-green-600 hover:text-green-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={onClearFilters}
            className="text-sm text-indigo-700 hover:text-indigo-900 font-medium"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}