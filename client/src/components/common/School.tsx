'use client';

import { School } from '@/api/school';

interface SchoolListProps {
  schools: School[];
}

export default function SchoolList({ schools }: SchoolListProps) {
  if (!schools.length) {
    return <p className="text-gray-500">No schools found.</p>;
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {schools.map((school) => (
        <li
          key={school.id}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
          {school.location && (
            <p className="text-sm text-gray-600">{school.location}</p>
          )}
          {school.createdAt && (
            <p className="text-xs text-gray-400 mt-1">
              Created: {new Date(school.createdAt).toLocaleDateString()}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
