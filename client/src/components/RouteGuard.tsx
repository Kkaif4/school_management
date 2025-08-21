'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const RouteGuard = ({ children, allowedRoles }: RouteGuardProps) => {
  const { data, loading, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (!loading) {
        if (!isAuthenticated()) {
          router.replace('/');
          return;
        }

        if (allowedRoles && !hasRole(allowedRoles)) {
          router.replace('/dashboard');
          return;
        }
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [loading, isAuthenticated, hasRole, router, allowedRoles]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
