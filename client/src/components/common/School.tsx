'use client';

import { School } from '@/api/school';
import { School as SchoolIcon, MapPin } from 'lucide-react';

interface SchoolListProps {
  schools: School[];
}

export default function SchoolList({ schools }: SchoolListProps) {
  if (!schools.length) {
    return <p className="text-slate-500 italic">No schools found.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {schools.map((school, index) => (
        <div
          key={school.id || index}
          className="bg-slate-50 hover:bg-slate-100 rounded-xl p-4 transition-all duration-200 cursor-pointer border border-transparent hover:border-indigo-200 group"
        >
          <div className="flex items-start justify-between">
            {/* Left Section */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <SchoolIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {school.name}
                  </h3>
                  {school.createdAt && (
                    <p className="text-xs text-slate-400">
                      Created: {new Date(school.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-3">
                {school.location && (
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{school.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
