'use client';

import { useState } from 'react';
import { User, Calendar, Phone, Home, Hash, Book, Users } from 'lucide-react';
import { StudentFormData, studentSchema } from '../student.schema';
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
    gender: 'male',
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

    const result = studentSchema.safeParse({
      ...formData,
      dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
      gender: formData.gender,
    });
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
      const response = await addStudent({
        ...result.data,
        gender: result.data.gender === '' ? undefined : result.data.gender,
      });

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
            className="mt-1 bg-gray-50 rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
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
            className="mt-1 bg-gray-50 rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
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
            className="mt-1 bg-gray-50 rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
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
            className="mt-1 bg-gray-50 rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
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
            className="mt-1 bg-gray-50 rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
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
            className="mt-1 bg-gray-50 rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
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
            className="mt-1 bg-gray-50 rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
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
            className="mt-1 bg-gray-50 rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition">
            <option value="">Select Grade</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Grade {i + 1}
              </option>
            ))}
          </select>
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
            className="mt-1 bg-gray-50 rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition">
            <option value="">Select Division</option>
            {['A', 'B', 'C', 'D', 'E'].map((div) => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </select>
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
            className="mt-1 bg-gray-50 rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
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
            className="mt-1 bg-gray-50 rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
        </label>
      </div>

      {/* Actions */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errors.submit} here is this error
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
