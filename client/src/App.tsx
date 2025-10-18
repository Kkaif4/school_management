import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from './components/ui/sonner';

// Lazy loaded components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/SchoolDashboard'));
const AdminControlPanel = lazy(() => import('./pages/AdminControlPanel'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Forbidden = lazy(() => import('./pages/Forbidden'));

const queryClient = new QueryClient();

// Loading component with full screen skeleton
const PageSkeleton = () => (
  <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-primary mx-auto"></div>
      <Skeleton className="h-4 w-32 mx-auto" />
    </div>
  </div>
);
// In your React component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />

              <Route
                path="/dashboard/:id"
                element={
                  <ProtectedRoute
                    allowedRoles={['teacher', 'sub_admin', 'admin']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/control-panel"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                    <AdminControlPanel />
                  </ProtectedRoute>
                }
              />

              {/* Forbidden Route */}
              <Route path="/forbidden" element={<Forbidden />} />

              {/* Redirects */}
              <Route path="/index" element={<Navigate to="/" replace />} />

              {/* Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
