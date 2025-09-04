'use client';

import { useState } from 'react';
import { User, Phone, Users, BookOpen } from 'lucide-react';
import {
  StudentFormData,
  studentSchema,
  Genders,
  Divisions,
} from '@/types/student';
import { studentAPI as addStudent } from '@/lib/api';

type Gender = typeof Genders;
type Division = typeof Divisions;

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
    studentId: '',
    registerNumber: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    birthPlace: '',
    gender: 'male',
    rollNumber: '',
    fatherName: '',
    motherName: '',
    adhaar: '',
    cast: '',
    religion: '',
    nationality: '',
    grade: '',
    division: '',
    contactNumber: '',
    address: '',
    previousSchoolName: '',
    admissionDate: '',
    customFields: [],
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
    setErrors({ ...errors, [e.target.name]: '' }); // clear error on change
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
      const parsedData = {
        ...result.data,
        rollNumber: Number(result.data.rollNumber),
        adhaar: Number(result.data.adhaar),
        grade: Number(result.data.grade),
        gender: result.data.gender in Genders ? result.data.gender : 'male',
        division:
          result.data.division in Divisions ? result.data.division : 'A',
      };
      console.log('Submitting student data:', parsedData);
      const response = await addStudent.createStudent(parsedData);
      onSuccess();
    } catch (err) {
      setErrors({
        submit: err.message || 'Failed to add student. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-md px-3 py-2 text-black placeholder-gray-400 bg-white border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm';

  const sectionClass = 'space-y-4';

  // helper to show errors under inputs
  const renderError = (field: string) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Student Info */}
      <div className={sectionClass}>
        <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <User className="h-5 w-5 text-indigo-500" />
          Student Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Student ID
            </label>
            <input
              name="studentId"
              className={inputClass}
              value={formData.studentId}
              onChange={handleChange}
            />
            {renderError('studentId')}
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Register Number
            </label>
            <input
              name="registerNumber"
              className={inputClass}
              value={formData.registerNumber}
              onChange={handleChange}
            />
            {renderError('registerNumber')}
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              First Name
            </label>
            <input
              name="firstName"
              className={inputClass}
              value={formData.firstName}
              onChange={handleChange}
            />
            {renderError('firstName')}
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Middle Name
            </label>
            <input
              name="middleName"
              className={inputClass}
              value={formData.middleName}
              onChange={handleChange}
            />
            {renderError('middleName')}
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Last Name
            </label>
            <input
              name="lastName"
              className={inputClass}
              value={formData.lastName}
              onChange={handleChange}
            />
            {renderError('lastName')}
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              className={inputClass}
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
            {renderError('dateOfBirth')}
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Birth Place
            </label>
            <input
              name="birthPlace"
              className={inputClass}
              value={formData.birthPlace}
              onChange={handleChange}
            />
            {renderError('birthPlace')}
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Gender</label>
            <select
              name="gender"
              className={inputClass}
              value={formData.gender}
              onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {renderError('gender')}
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Roll Number
            </label>
            <input
              name="rollNumber"
              className={inputClass}
              value={formData.rollNumber}
              onChange={handleChange}
            />
            {renderError('rollNumber')}
          </div>
        </div>
      </div>

      {/* Family Info */}
      <div className={sectionClass}>
        <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <Users className="h-5 w-5 text-indigo-500" />
          Family Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Father's Name
            </label>
            <input
              name="fatherName"
              className={inputClass}
              value={formData.fatherName}
              onChange={handleChange}
            />
            {renderError('fatherName')}
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Mother's Name
            </label>
            <input
              name="motherName"
              className={inputClass}
              value={formData.motherName}
              onChange={handleChange}
            />
            {renderError('motherName')}
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Aadhaar Number
            </label>
            <input
              name="adhaar"
              className={inputClass}
              value={formData.adhaar}
              onChange={handleChange}
            />
            {renderError('adhaar')}
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Caste</label>
            <input
              name="cast"
              className={inputClass}
              value={formData.cast}
              onChange={handleChange}
            />
            {renderError('cast')}
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Religion</label>
            <input
              name="religion"
              className={inputClass}
              value={formData.religion}
              onChange={handleChange}
            />
            {renderError('religion')}
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Nationality
            </label>
            <input
              name="nationality"
              className={inputClass}
              value={formData.nationality}
              onChange={handleChange}
            />
            {renderError('nationality')}
          </div>
        </div>
      </div>

      {/* Academic Info */}
      <div className={sectionClass}>
        <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <BookOpen className="h-5 w-5 text-indigo-500" />
          Academic Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Grade</label>
            <select
              name="grade"
              className={inputClass}
              value={formData.grade}
              onChange={handleChange}>
              <option value="">Select Grade</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((_, i) => (
                <option key={i} value={i + 1}>
                  Grade {i + 1}
                </option>
              ))}
            </select>
            {renderError('grade')}
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Division</label>
            <select
              name="division"
              className={inputClass}
              value={formData.division}
              onChange={handleChange}>
              <option value="">Select Division</option>
              {Divisions.map((division, i) => (
                <option key={i} value={division}>
                  {division}
                </option>
              ))}
            </select>
            {renderError('division')}
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Previous School Name
            </label>
            <input
              name="previousSchoolName"
              className={inputClass}
              value={formData.previousSchoolName}
              onChange={handleChange}
            />
            {renderError('previousSchoolName')}
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Admission Date
            </label>
            <input
              type="date"
              name="admissionDate"
              className={inputClass}
              value={formData.admissionDate}
              onChange={handleChange}
            />
            {renderError('admissionDate')}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className={sectionClass}>
        <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <Phone className="h-5 w-5 text-indigo-500" />
          Contact Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Contact Number
            </label>
            <input
              name="contactNumber"
              className={inputClass}
              value={formData.contactNumber}
              onChange={handleChange}
            />
            {renderError('contactNumber')}
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Address</label>
            <input
              name="address"
              className={inputClass}
              value={formData.address}
              onChange={handleChange}
            />
            {renderError('address')}
          </div>
        </div>
      </div>

      {/* Submit-level error */}
      {errors.submit && (
        <p className="text-red-600 text-sm font-medium">{errors.submit}</p>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
