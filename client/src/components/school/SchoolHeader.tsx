// components/SchoolHeader.tsx
import { Home, MapPin } from 'lucide-react';
import { School as SchoolType } from '@/types/school';

interface SchoolHeaderProps {
  school: SchoolType;
}

export default function SchoolHeader({ school }: SchoolHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4 sm:mb-6">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3 mb-3 sm:mb-0 self-start sm:self-auto">
          <Home className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            {school.name}
          </h1>
          {school.address && (
            <div className="flex items-center mt-2 text-white/90 text-sm sm:text-base">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="break-words">{school.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
