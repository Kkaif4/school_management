// components/SchoolInfo.tsx
import { Home, MapPin, GraduationCap, Users } from 'lucide-react';
import { School as SchoolType } from '@/api/school';

interface SchoolInfoProps {
  school: SchoolType;
}

export default function SchoolInfo({ school }: SchoolInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">School Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-50 p-2 rounded-lg">
              <Home className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">School Name</p>
              <p className="font-medium text-gray-900">{school.name}</p>
            </div>
          </div>
          {school.location && (
            <div className="flex items-center space-x-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{school.location}</p>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-50 p-2 rounded-lg">
              <GraduationCap className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Principal Name</p>
              <p className="font-medium text-gray-900">{school.principalName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-gray-50 p-2 rounded-lg">
              <Users className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact Number</p>
              <p className="font-medium text-gray-900">{school.contactNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}