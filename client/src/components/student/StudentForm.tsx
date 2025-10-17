import { useState } from 'react';
import { User, BookOpen } from 'lucide-react';
import { studentSchema } from '@/types/student';
import { RequiredLabel } from '../ui/RequiredLabel';
import { studentAPI as addStudent } from '@/lib/api';
import { toast } from '@/components/ui/sonner';

interface customField {
  name?: string;
  type?: 'string' | 'number' | 'date' | 'boolean';
  required?: boolean;
}

interface AddStudentFormProps {
  schoolId: string;
  customField?: customField[];
  onSuccess: () => void;
  onCancel: () => void;
}

type FormDataType = {
  studentId: string;
  registrationNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  rollNumber: string;
  grade: string;
  division: string;
  schoolId: string;
  customField: {
    fieldName: string;
    fieldValue: string | number | boolean | null;
    type?: 'string' | 'number' | 'date' | 'boolean';
  }[];
};

const fieldLabels: Record<string, string> = {
  studentId: 'Student ID',
  registrationNumber: 'Register Number',
  firstName: 'First Name',
  middleName: 'Middle Name',
  lastName: 'Last Name',
  dateOfBirth: 'Date of Birth',
  gender: 'Gender',
  rollNumber: 'Roll Number',
  grade: 'Grade',
  division: 'Division',
};

const requiredFields = [
  'studentId',
  'registrationNumber',
  'firstName',
  'lastName',
  'dateOfBirth',
  'rollNumber',
  'grade',
  'division',
  'gender',
];

export default function AddStudentForm({
  schoolId,
  customField,
  onSuccess,
  onCancel,
}: AddStudentFormProps) {
  const [formData, setFormData] = useState<FormDataType>({
    studentId: '',
    registrationNumber: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male',
    rollNumber: '',
    grade: '',
    division: '',
    schoolId,
    customField: customField.map((f) => ({
      fieldName: f.name,
      fieldValue: f.type === 'boolean' ? 'false' : '',
    })),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const inputClass =
    'w-full rounded-md px-3 py-2 text-black placeholder-gray-400 bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base';

  const renderError = (field: string) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCustomFieldChange = (index: number, value: string | boolean) => {
    setFormData((prev) => {
      const updated = [...prev.customField];
      const type = updated[index].type;

      if (type === 'number') {
        updated[index].fieldValue = value === '' ? '' : Number(value);
      } else if (type === 'boolean') {
        updated[index].fieldValue = value;
      } else if (type === 'date') {
        updated[index].fieldValue = value;
      } else {
        updated[index].fieldValue = value;
      }

      return { ...prev, customField: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      ...formData,
      customFields: formData.customField.reduce((acc, curr) => {
        acc[curr.fieldName] = curr.fieldValue;
        return acc;
      }, {} as Record<string, string | number | boolean | null>),
    };
    delete payload.customField;

    const result = studentSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path.join('.');
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      });
      toast.error('Please fill in all fields.');
      setErrors(fieldErrors);
      return;
    }
    try {
      setLoading(true);
      const res = await addStudent.createStudent(result.data);
      toast(res.data.message);
      onSuccess();
      onCancel();
    } catch (err) {
      if (err) {
        console.log('this is error: ', err);
        setErrors({
          submit:
            err.response?.data?.validationErrors[0] ||
            err.response?.data?.message ||
            err.message ||
            'Failed to add student. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Student Info */}
      <div>
        <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <User className="h-5 w-5 text-indigo-500" /> Student Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(fieldLabels).map((field) => {
            const isRequired = requiredFields.includes(field);

            // Dropdown fields
            if (['grade', 'gender', 'division'].includes(field)) {
              const options =
                field === 'grade'
                  ? Array.from({ length: 12 }, (_, i) => (i + 1).toString())
                  : field === 'gender'
                  ? ['male', 'female', 'other']
                  : ['A', 'B', 'C', 'D'];

              return (
                <div key={field}>
                  {isRequired ? (
                    <RequiredLabel>{fieldLabels[field]}</RequiredLabel>
                  ) : (
                    <label className="text-sm text-gray-600 mb-1 block">
                      {fieldLabels[field]}
                    </label>
                  )}
                  <select
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className={inputClass}>
                    <option value="">Select {fieldLabels[field]}</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {field === 'grade' ? `Grade ${opt}` : opt}
                      </option>
                    ))}
                  </select>
                  {renderError(field)}
                </div>
              );
            }

            return (
              <div key={field}>
                {isRequired ? (
                  <RequiredLabel>{fieldLabels[field]}</RequiredLabel>
                ) : (
                  <label className="text-sm text-gray-600 mb-1 block">
                    {fieldLabels[field]}
                  </label>
                )}
                <input
                  type={field === 'dateOfBirth' ? 'date' : 'text'}
                  name={field}
                  value={formData[field] ?? ''}
                  onChange={handleChange}
                  className={inputClass}
                />
                {renderError(field)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Fields */}
      {customField.length > 0 && (
        <div>
          <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <BookOpen className="h-5 w-5 text-indigo-500" /> Extra Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customField.map((field, index) => (
              <div key={field.name}>
                <label className="text-sm text-gray-600 mb-1 block">
                  {field.name}{' '}
                  {field.required && <span className="text-red-500">*</span>}
                </label>

                {field.type === 'boolean' ? (
                  <input
                    type="checkbox"
                    checked={formData.customField[index].fieldValue as boolean}
                    onChange={(e) =>
                      handleCustomFieldChange(index, e.target.checked)
                    }
                    required={field.required}
                  />
                ) : (
                  <input
                    type={
                      field.type === 'date'
                        ? 'date'
                        : field.type === 'number'
                        ? 'number'
                        : 'text'
                    }
                    className={inputClass}
                    value={
                      formData.customField[index].fieldValue?.toString() ?? ''
                    }
                    onChange={(e) =>
                      handleCustomFieldChange(index, e.target.value)
                    }
                    required={field.required}
                  />
                )}

                {field.required && !formData.customField[index].fieldValue && (
                  <p className="text-red-500 text-xs mt-1">
                    {field.name} is required.
                  </p>
                )}

                {renderError(`customField.${index}.fieldValue`)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {errors.submit && (
        <p className="text-red-600 text-sm font-medium">{errors.submit}</p>
      )}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition w-full sm:w-auto">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-50 w-full sm:w-auto">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
