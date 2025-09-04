import { useState } from 'react';
import { User, Mail, Shield, EyeOff, Eye, Save, X } from 'lucide-react';
import { TeacherFormData, UserRole } from '@/types/teacher';
import { teacherAPI } from '@/lib/api';
import { teacherSchema } from '@/types/teacher';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface AddTeacherFormProps {
  schoolId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddTeacherForm({
  schoolId,
  onSuccess,
  onCancel,
}: AddTeacherFormProps) {
  const [formData, setFormData] = useState<TeacherFormData>({
    name: '',
    email: '',
    password: '',
    role: UserRole.TEACHER,
    schoolId,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      const response = await teacherAPI.createTeacher(result.data);
      if (!response.data.success) {
        setErrors({ submit: response.data.message });
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Add Teacher</h2>
        <p className="text-muted-foreground">
          Fill out the details to onboard a new teacher
        </p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter full name"
          value={formData.name}
          onChange={handleChange}
          className={
            errors.name
              ? 'border-red-500'
              : 'border-purple-primary/30 focus:border-purple-primary'
          }
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          className={
            errors.email
              ? 'border-red-500'
              : 'border-purple-primary/30 focus:border-purple-primary'
          }
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className={`pr-10 ${
              errors.password
                ? 'border-red-500'
                : 'border-purple-primary/30 focus:border-purple-primary'
            }`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password}</p>
        )}
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full rounded-md border border-purple-primary/30 focus:border-purple-primary px-3 py-2">
          <option value={UserRole.TEACHER}>Teacher</option>
        </select>
        {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errors.submit}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" variant="gradient" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
