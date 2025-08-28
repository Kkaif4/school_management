// components/SchoolHeader.tsx
import { Home, MapPin } from 'lucide-react';
import { School as SchoolType } from '@/api/school';

interface SchoolHeaderProps {
  school: SchoolType;
}

export default function SchoolHeader({ school }: SchoolHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
          <Home className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{school.name}</h1>
          {school.location && (
            <div className="flex items-center mt-2 text-white/90">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{school.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
