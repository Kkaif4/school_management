import { useState, useEffect } from 'react';
import { AuthResponse } from '../api/auth';

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AuthData = {
  success: boolean;
  message: string;
  token: string;
  user: User;
};

export const useAuth = () => {
  const [data, setData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser: AuthData = JSON.parse(storedUser);
          setData(parsedUser);
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('user');
        }
      }

      setLoading(false);
    };

    initAuth();

    // Sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        if (e.newValue) {
          setData(JSON.parse(e.newValue) as AuthData);
        } else {
          setData(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (authResponse: AuthResponse) => {
    if (!authResponse?.success)
      throw new Error(authResponse?.message || 'Login failed');

    const userData: AuthData = {
      success: authResponse.success,
      message: authResponse.message,
      token: authResponse.token,
      user: authResponse.user,
    };

    localStorage.setItem('user', JSON.stringify(userData));
    setData(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setData(null);
  };

  const hasRole = (roles: string[]): boolean => {
    if (!data || !data.user) return false;
    return roles.includes(data.user.role);
  };

  const isAuthenticated = (): boolean => !!data;

  return {
    data,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated,
  };
};
