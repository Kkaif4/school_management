"use client";

import React, { useEffect, useState } from "react";
import { Plus, School } from "lucide-react";
import SchoolList from "@/components/common/School";
import SchoolFormModal from "./forms/schoolFormModal";
import { getSchools } from "@/api/school";

interface School {
  id: string;
  name: string;
  location?: string;
}

interface SchoolsSectionProps {
  schools: School[];
  loadingSchools: boolean;
  onAddSchool: () => void; // still here if you want external trigger
}

export const SchoolsSection: React.FC<SchoolsSectionProps> = ({
  schools,
  loadingSchools,
  onAddSchool,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schoolData, setSchoolData] = useState(schools);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const Refresh = async () => {
    console.log("refreshing");
    const response = await getSchools();
    setSchoolData(response.schools);
  };
  useEffect(() => {
    setSchoolData(schools);
  }, [schools]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">
            Your Schools
          </h3>
          <p className="text-slate-500 text-sm">
            Manage and monitor your educational institutions
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add School
        </button>
        <button onClick={Refresh} className="text-black">
          refresh
        </button>
      </div>

      {loadingSchools ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Loading schools...</p>
            <p className="text-slate-400 text-sm">
              Please wait while we fetch your data
            </p>
          </div>
        </div>
      ) : schools.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <School className="w-8 h-8 text-slate-400" />
          </div>
          <h4 className="text-lg font-semibold text-slate-700 mb-2">
            No schools found
          </h4>
          <p className="text-slate-500 mb-4">
            Start by adding your first educational institution
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mt-6">
            <SchoolList schools={schoolData} />
          </div>
        </div>
      )}

      {/* 👇 School Modal */}
      <SchoolFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={() => {
          handleCloseModal();
          onAddSchool(); // refresh schools list after adding
        }}
      />
    </div>
  );
};
