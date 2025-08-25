'use client';

import { useState } from 'react';
import { User, Calendar, Phone, Home, Hash, Book, Users } from 'lucide-react';
import { StudentFormData, studentSchema } from '../schema';
import { addStudent } from '@/api/students';

interface AddStudentFormProps {
  schoolId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddStudentForm({
  schoolId,
  onSuccess,
  onCancel,
}: AddStudentFormProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    rollNumber: '',
    fatherName: '',
    motherName: '',
    grade: '',
    division: '',
    contactNumber: '',
    address: '',
    schoolId: schoolId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = studentSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      console.log(result.data);
      const response = await addStudent(result.data);

      if (!response.success) {
        setErrors({ submit: response.message });
        return;
      }
      onSuccess();
    } catch (err) {
      console.error('Failed to add student:', err);
      setErrors({ submit: 'Failed to add student. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 text-black animate-fadeIn">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Add Student</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* First Name */}
        <label className="flex flex-col">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <User size={16} /> First Name
          </span>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className={`mt-1 bg-gray-50 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition
              ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.firstName && (
            <span className="text-red-500 text-xs mt-1">{errors.firstName}</span>
          )}
        </label>

        {/* Middle Name */}
        <label className="flex flex-col">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <User size={16} /> Middle Name
          </span>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            className={`mt-1 bg-gray-50 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition
              ${errors.middleName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.middleName && (
            <span className="text-red-500 text-xs mt-1">{errors.middleName}</span>
          )}
        </label>

        {/* Last Name */}
        <label className="flex flex-col">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <User size={16} /> Last Name
          </span>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className={`mt-1 bg-gray-50 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition
              ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.lastName && (
            <span className="text-red-500 text-xs mt-1">{errors.lastName}</span>
          )}
        </label>

        {/* Date of Birth */}
        <label className="flex flex-col">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Calendar size={16} /> Date of Birth
          </span>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className={`mt-1 bg-gray-50 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition
              ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.dateOfBirth && (
            <span className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</span>
          )}
        </label>

        {/* Gender */}
        <label className="flex flex-col">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Users size={16} /> Gender
          </span>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className={`mt-1 bg-gray-50 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition
              ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <span className="text-red-500 text-xs mt-1">{errors.gender}</span>
          )}
        </label>

        {/* Roll Number */}
        <label className="flex flex-col">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Hash size={16} /> Roll Number
          </span>
          <input
            type="text"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            required
            className={`mt-1 bg-gray-50 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition
              ${errors.rollNumber ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.rollNumber && (
            <span className="text-red-500 text-xs mt-1">{errors.rollNumber}</span>
          )}
        </label>

        {/* Father Name */}
        <label className="flex flex-col">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <User size={16} /> Father Name
          </span>
          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            required
            className={`mt-1 bg-gray-50 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition
              ${errors.fatherName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.fatherName && (
            <span className="text-red-500 text-xs mt-1">{errors.fatherName}</span>
          )}
        </label>

        {/* Mother Name */}
        <label className="flex flex-col">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <User size={16} /> Mother Name
          </span>
          <input
            type="text"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            required
            className={`mt-1 bg-gray-50 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition
              ${errors.motherName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.motherName && (
            <span className="text-red-500 text-xs mt-1">{errors.motherName}</span>
          )}
        </label>

        {/* Grade */}
        <label className="flex flex-col">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Book size={16} /> Grade
          </span>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
            className={`mt-1 bg-gray-50 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition
              ${errors.grade ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Select Grade</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Grade {i + 1}
              </option>
            ))}
          </select>
          {errors.grade && (
            <span className="text-red-500 text-xs mt-1">{errors.grade}</span>
          )}
        </label>

        {/* Division */}
        <label className="flex flex-col">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Book size={16} /> Division
          </span>
          <select
            name="division"
            value={formData.division}
            onChange={handleChange}
            required
            className={`mt-1 bg-gray-50 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition
              ${errors.division ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Select Division</option>
            {['A', 'B', 'C', 'D', 'E'].map((div) => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </select>
          {errors.division && (
            <span className="text-red-500 text-xs mt-1">{errors.division}</span>
          )}
        </label>

        {/* Contact Number */}
        <label className="flex flex-col">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Phone size={16} /> Contact Number
          </span>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            className={`mt-1 bg-gray-50 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition
              ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.contactNumber && (
            <span className="text-red-500 text-xs mt-1">{errors.contactNumber}</span>
          )}
        </label>

        {/* Address */}
        <label className="flex flex-col md:col-span-3">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Home size={16} /> Address
          </span>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className={`mt-1 bg-gray-50 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition
              ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.address && (
            <span className="text-red-500 text-xs mt-1">{errors.address}</span>
          )}
        </label>
      </div>

      {/* Actions */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errors.submit}
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition 
            disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition
            disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center gap-2">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
