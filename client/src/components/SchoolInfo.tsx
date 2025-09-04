// components/SchoolInfo.tsx
import { useState } from 'react';
import { Home, MapPin, GraduationCap, Users, Plus } from 'lucide-react';
import { School as SchoolType } from '@/types/school';
import { Button } from './ui/button';
import CertificateForm from './CertificateForm'; // <-- import the form

interface SchoolInfoProps {
  school: SchoolType;
}

export default function SchoolInfo({ school }: SchoolInfoProps) {
  const [showCertificateForm, setShowCertificateForm] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        School Information
      </h2>
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
          {school.address && (
            <div className="flex items-center space-x-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{school.address}</p>
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
              <p className="font-medium text-gray-900">
                {school.principalName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-gray-50 p-2 rounded-lg">
              <Users className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact Number</p>
              <p className="font-medium text-gray-900">
                {school.contactNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Add Certificate */}
        <div className="flex items-center space-x-3">
          <div>
            <p className="text-sm text-gray-500">Add Certificate</p>
            <Button
              className="mt-2"
              onClick={() => setShowCertificateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Certificate
            </Button>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificateForm && (
        <CertificateForm
          schoolId={school._id}
          onClose={() => setShowCertificateForm(false)}
          onSuccess={() => {
            setShowCertificateForm(false);
          }}
        />
      )}
    </div>
  );
}
