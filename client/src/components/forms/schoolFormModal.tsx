"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/api/axios";
import { School } from "@/api/school";

interface SchoolFormData {
  name: string;
  principalName: string;
  address: string;
  contactNumber: string;
}

type SchoolFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (school: School) => void;
  editingSchool?: School | null;
};

export default function SchoolFormModal({
  isOpen,
  onClose,
  onSuccess,
  editingSchool = null,
}: SchoolFormModalProps) {
  const { data } = useAuth();
  const [formData, setFormData] = useState<SchoolFormData>({
    name: "",
    principalName: "",
    address: "",
    contactNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal opens/closes or when editingSchool changes
  useEffect(() => {
    if (isOpen) {
      if (editingSchool) {
        setFormData({
          name: editingSchool.name || "",
          principalName: "", // Note: API response doesn't include principalName
          address: editingSchool.location || "",
          contactNumber: "", // Note: API response doesn't include contactNumber
        });
      } else {
        setFormData({
          name: "",
          principalName: "",
          address: "",
          contactNumber: "",
        });
      }
      setError("");
    }
  }, [isOpen, editingSchool]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        adminId: data?.user?.id,
      };

      let response;

      if (editingSchool) {
        // Update existing school
        response = await api.put(`/school/${editingSchool.id}`, payload);
      } else {
        // Create new school
        response = await api.post("/school", payload);
        
      }

      if (onSuccess) {
        const schoolData = response.data?.data || response.data;
        onSuccess({
          id: schoolData._id || schoolData.id || editingSchool?.id || "",
          name: schoolData.name,
          location: schoolData.address || schoolData.location,
          createdAt: schoolData.createdAt,
        });
      }

      onClose();
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Failed to save school";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white">
          <h2 className="text-xl font-semibold">
            {editingSchool ? "Edit School" : "Add New School"}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                School Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter school name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="principalName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Principal Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="principalName"
                name="principalName"
                placeholder="Enter principal's name"
                value={formData.principalName}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={2}
                placeholder="Enter school address"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                placeholder="Enter contact number"
                value={formData.contactNumber}
                onChange={handleChange}
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-50"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 
             hover:bg-gray-100 hover:text-gray-900 transition-colors 
             disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || !data?.user?.id}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {editingSchool ? "Updating..." : "Saving..."}
                  </>
                ) : editingSchool ? (
                  "Update School"
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
