import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const RouteGuard = ({ children, allowedRoles }: RouteGuardProps) => {
  const { user, loading, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        router.push('/');
        return;
      }

      if (allowedRoles && !hasRole(allowedRoles)) {
        router.push('/dashboard');
        return;
      }
    }
  }, [loading, isAuthenticated, hasRole, router, allowedRoles]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
