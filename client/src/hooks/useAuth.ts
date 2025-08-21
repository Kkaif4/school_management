import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'SUB_ADMIN' | 'TEACHER';
  schoolId?: string;
  token: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const getSchoolId = (): string | undefined => {
    return user?.schoolId;
  };

  const isAuthenticated = (): boolean => {
    return !!user;
  };

  return {
    user,
    loading,
    login,
    logout,
    hasRole,
    getSchoolId,
    isAuthenticated,
  };
};
