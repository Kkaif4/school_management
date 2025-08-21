'use client';
import {
  Mail,
  Lock,
  User,
  Loader2,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { loginUser, registerUser } from '@/api/auth';

interface AuthFormProps {
  onSuccess?: () => void;
}

export const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const data = isLogin
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser(form);

      login(data);
      onSuccess?.();
      router.replace('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">
          {isLogin ? 'Welcome Back!' : 'Create an Account'}
        </h1>
        <p className="text-slate-500 mt-2">
          {isLogin
            ? 'Sign in to continue to your dashboard.'
            : 'Get started with us today!'}
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-600">
              Name
            </label>
            <div className="relative mt-2">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 peer-focus:text-teal-500 transition-colors" />
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="peer block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-11 pr-4 text-slate-800 shadow-sm transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:bg-slate-100"
              />
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-600">
            Email
          </label>
          <div className="relative mt-2">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 peer-focus:text-teal-500 transition-colors" />
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="peer block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-11 pr-4 text-slate-800 shadow-sm transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:bg-slate-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-600">
            Password
          </label>
          <div className="relative mt-2">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 peer-focus:text-teal-500 transition-colors" />

            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="peer block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-11 pr-11 text-slate-800 shadow-sm transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:bg-slate-100"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1} // prevents accidental tab stop
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          // RE-STYLED: Button has better padding, shadow, and focus states
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-teal-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : isLogin ? (
            'Login'
          ) : (
            'Register'
          )}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          disabled={loading}
          className="text-sm font-medium text-teal-600 transition-colors hover:text-teal-800 hover:underline disabled:opacity-50">
          {isLogin
            ? 'Need an account? Register'
            : 'Already have an account? Login'}
        </button>
      </div>
    </>
  );
};
