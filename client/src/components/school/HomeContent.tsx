import { formatDate, School } from '@/types/school';
import {
  Home,
  Plus,
  Users,
  Trash,
  MapPin,
  FileText,
  GraduationCap,
} from 'lucide-react';
import StatCard from '../StatCard';
import { useEffect, useState } from 'react';
import { certificateAPI } from '@/lib/api';
import { Button } from '../ui/button';
import CertificateForm from './CertificateForm';
import WarningModal from '../ui/warning';
import { handleError } from '@/utils/handleError';
import { useCertificateStore } from '@/stores/certificateStore';

interface HomeContentProps {
  school: School;
}

export default function HomeContent({ school }: HomeContentProps) {
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const { certificates, fetchCertificates, loading, error } =
    useCertificateStore();

  useEffect(() => {
    if (school?._id) {
      fetchCertificates(school._id);
    }
  }, [school?._id, fetchCertificates]);

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      // 1. Make the API call to delete the item
      const response = await certificateAPI.deleteCertificate(itemToDelete);
      if (!response.data.success) {
        const errorData = await response.data.error();
        throw new Error(errorData.message || 'Failed to delete the item.');
      }
      fetchCertificates(school._id);
    } catch (error) {
      handleError(error.response.data.message);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div className="space-y-8">
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
      <div className="p-4">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <StatCard
            label="Total Students"
            value={school.totalStudents || 0}
            icon={<GraduationCap />}
            subText="Active enrollment"
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />

          <StatCard
            label="Total Teachers"
            value={school.totalTeachers || 0}
            icon={<Users />}
            subText="Faculty strength"
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Organization Information
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
                <p className="text-xs sm:text-sm text-gray-500">
                  Name
                </p>
                <p className="font-medium text-gray-900 break-words">
                  {school.name}
                </p>
              </div>
            </div>

            <div className="flex items-start sm:items-center space-x-3">
              <div className="bg-gray-50 p-2 rounded-lg shrink-0">
                <MapPin className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900 break-words">
                  {school.address ? (
                    <span>{school.address}</span>
                  ) : (
                    <i className="text-muted-foreground">Not provided</i>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Principal */}
            <div className="flex items-start sm:items-center space-x-3">
              <div className="bg-gray-50 p-2 rounded-lg shrink-0">
                <GraduationCap className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Principal Name
                </p>
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
                <p className="text-xs sm:text-sm text-gray-500">
                  Contact Number
                </p>
                <p className="font-medium text-gray-900 break-words">
                  {school.contactNumber ? (
                    <span>{school.contactNumber}</span>
                  ) : (
                    <i className="text-muted-foreground">Not provided</i>
                  )}
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

          {loading ? (
            <p className="text-gray-500 text-sm">Loading certificates...</p>
          ) : error ? (
            <p className="text-red-600 text-sm">{error}</p>
          ) : certificates.length === 0 ? (
            <p className="text-gray-500 text-sm">No certificates added yet.</p>
          ) : (
            <ul className="space-y-2">
              {certificates.map((cert) => (
                <li
                  key={cert._id}
                  className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-100">
                  {/* Left side: Icon and Name */}
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm sm:text-base font-medium text-gray-900 truncate pr-2">
                      {cert.name}
                    </span>
                  </div>

                  {/* Right side: Date and Delete Button */}
                  <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                    <span className="text-xs sm:text-sm text-gray-500">
                      {formatDate(cert.createdAt)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(cert._id)}>
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
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
        <WarningModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the certificate? This action cannot be undone.`}
        />

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
    </div>
  );
}
