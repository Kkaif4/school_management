'use client';

import { useState } from 'react';
import { User, Mail, Lock, Shield } from 'lucide-react';
import { z } from 'zod';
import { teacherSchema } from '../schema';
import { addTeacher } from '@/api/teachers';

interface AddTeacherFormProps {
  schoolId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

type TeacherFormData = z.infer<typeof teacherSchema>;

export default function AddTeacherForm({
  schoolId,
  onSuccess,
  onCancel,
}: AddTeacherFormProps) {
  const [formData, setFormData] = useState<TeacherFormData>({
    name: '',
    email: '',
    password: '',
    role: 'teacher',
    schoolId: schoolId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = teacherSchema.safeParse(formData);
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
      const response = await addTeacher(result.data);
      if (!response.success) {
        setErrors({ submit: response.message });
        return;
      }
      onSuccess();
    } catch (err) {
      console.log('Failed to add teacher:', err);
      if (err instanceof Error) {
        setErrors({ submit: err.message });
      } else {
        setErrors({ submit: 'Failed to add teacher. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 text-black animate-fadeIn">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Add Teacher</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <label className="flex flex-col">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <User size={16} /> Name
          </span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`mt-1 bg-gray-50 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition
              ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </label>

        {/* Email */}
        <label className="flex flex-col">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Mail size={16} /> Email
          </span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`mt-1 bg-gray-50 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition
              ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </label>

        {/* Password */}
        <label className="flex flex-col">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Lock size={16} /> Password
          </span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`mt-1 bg-gray-50 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition
              ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          )}
        </label>

        {/* Role */}
        <label className="flex flex-col">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Shield size={16} /> Role
          </span>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className={`mt-1 bg-gray-50 rounded-xl border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition
              ${errors.role ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="teacher">Teacher</option>
          </select>
          {errors.role && (
            <p className="text-xs text-red-500 mt-1">{errors.role}</p>
          )}
        </label>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errors.submit}
        </div>
      )}

      {/* Actions */}
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
