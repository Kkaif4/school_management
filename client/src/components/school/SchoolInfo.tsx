import { useState, useEffect } from 'react';
import {
  Home,
  MapPin,
  GraduationCap,
  Users,
  Plus,
  FileText,
} from 'lucide-react';
import { formatDate, School as SchoolType } from '@/types/school';
import { Button } from '../ui/button';
import CertificateForm from './CertificateForm';
import { certificateAPI } from '@/lib/api';

interface SchoolInfoProps {
  school: SchoolType;
}

export default function SchoolInfo({ school }: SchoolInfoProps) {
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(false);
  const [certError, setCertError] = useState<string | null>(null);

  const fetchCertificates = async () => {
    setLoadingCerts(true);
    setCertError(null);
    try {
      const response = await certificateAPI.getCertificates(school._id);
      setCertificates(response.data || []);
    } catch (err: any) {
      console.log('Error fetching certificates:', err);
      setCertError(err.message || 'Failed to fetch certificates');
    } finally {
      setLoadingCerts(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [school._id]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
        School Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* School Name */}
          <div className="flex items-start sm:items-center space-x-3">
            <div className="bg-gray-50 p-2 rounded-lg shrink-0">
              <Home className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">School Name</p>
              <p className="font-medium text-gray-900 break-words">
                {school.name}
              </p>
            </div>
          </div>

          {/* Address */}
          {school.address && (
            <div className="flex items-start sm:items-center space-x-3">
              <div className="bg-gray-50 p-2 rounded-lg shrink-0">
                <MapPin className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900 break-words">
                  {school.address}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Principal */}
          <div className="flex items-start sm:items-center space-x-3">
            <div className="bg-gray-50 p-2 rounded-lg shrink-0">
              <GraduationCap className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Principal Name</p>
              <p className="font-medium text-gray-900 break-words">
                {school.principalName}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex items-start sm:items-center space-x-3">
            <div className="bg-gray-50 p-2 rounded-lg shrink-0">
              <Users className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Contact Number</p>
              <p className="font-medium text-gray-900 break-words">
                {school.contactNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate List */}
      <div className="space-y-2">
        <h3 className="text-sm sm:text-base font-semibold text-gray-700">
          Certificates
        </h3>

        {loadingCerts ? (
          <p className="text-gray-500 text-sm">Loading certificates...</p>
        ) : certError ? (
          <p className="text-red-600 text-sm">{certError}</p>
        ) : certificates.length === 0 ? (
          <p className="text-gray-500 text-sm">No certificates added yet.</p>
        ) : (
          <ul className="space-y-2">
            {certificates.map((cert) => (
              <li
                key={cert._id}
                className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm sm:text-base font-medium text-gray-900">
                    {cert.name}
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-gray-500">
                  {formatDate(cert.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="col-span-1 md:col-span-2">
          <Button
            className="mt-2 w-full sm:w-auto"
            onClick={() => setShowCertificateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Certificate
          </Button>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificateForm && (
        <CertificateForm
          schoolId={school._id}
          onClose={() => setShowCertificateForm(false)}
          onSuccess={() => {
            setShowCertificateForm(false);
            fetchCertificates(); // Refresh list after adding
          }}
        />
      )}
    </div>
  );
}
