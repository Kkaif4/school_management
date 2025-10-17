import { useState } from 'react';
import { EyeOff, Eye, Save, X } from 'lucide-react';
import { UserFormData, UserRole } from '@/types/users';
import { userAPI } from '@/lib/api';
import { userSchema } from '@/types/users';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';

interface AddUserFormProps {
  schoolId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddUserForm({
  schoolId,
  onSuccess,
  onCancel,
}: AddUserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
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

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    const result = userSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      toast.error(result.error.message);
      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await userAPI.createUser(result.data);
      toast(response.data.message);
      onSuccess();
    } catch (err) {
      if (err) {
        const errorMessage =
          err.response?.data?.validationErrors?.[0] ||
          err.response?.data?.message ||
          err.message;
        setErrors({
          submit: errorMessage,
        });
        toast(errorMessage);
      } else {
        toast('Failed to add user. Please try again.');
        setErrors({ submit: 'Failed to add user. Please try again.' });
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 text-sm sm:text-base sm:space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
          Add Teacher
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Fill out the details to onboard a new user
        </p>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
        {/* Name */}
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="name" className="text-xs sm:text-sm">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            className={`h-8 sm:h-10 px-2 sm:px-3 ${
              errors.name
                ? 'border-red-500'
                : 'border-purple-primary/30 focus:border-purple-primary'
            }`}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="email" className="text-xs sm:text-sm">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`h-8 sm:h-10 px-2 sm:px-3 ${
              errors.email
                ? 'border-red-500'
                : 'border-purple-primary/30 focus:border-purple-primary'
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1 sm:space-y-2 md:col-span-2">
          <Label htmlFor="password" className="text-xs sm:text-sm">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`h-8 sm:h-10 pr-8 sm:pr-10 px-2 sm:px-3 ${
                errors.password
                  ? 'border-red-500'
                  : 'border-purple-primary/30 focus:border-purple-primary'
              }`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-2 sm:px-3"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-1 sm:space-y-2 md:col-span-2">
          <Label htmlFor="role" className="text-xs sm:text-sm">
            Role
          </Label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full h-8 sm:h-10 rounded-md border border-purple-primary/30 focus:border-purple-primary px-2 sm:px-3 text-xs sm:text-sm">
            <option value={UserRole.TEACHER}>Teacher</option>
          </select>
          {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-xs sm:text-sm">
          {errors.submit}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="h-8 sm:h-10 text-xs sm:text-sm w-full sm:w-auto">
          <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          variant="gradient"
          disabled={loading}
          className="h-8 sm:h-10 text-xs sm:text-sm w-full sm:w-auto">
          <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
