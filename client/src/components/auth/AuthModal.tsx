import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GraduationCap } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { useModalStore } from '@/lib/modalStore';

interface AuthModalProps {
  type: 'login' | 'signup';
  onClose: () => void;
}

export const AuthModal = ({ type, onClose }: AuthModalProps) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { openAuthModal } = useModalStore();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 200);
  };

  const handleSuccess = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      navigate('/admin/control-panel', { replace: true });
    } else if (user?.role === 'teacher' && user?.schoolId) {
      navigate(`/dashboard/${user.schoolId}`, { replace: true });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-gradient-subtle backdrop-blur-md" />

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md shadow-elegant border-purple-primary/20 bg-white/95 backdrop-blur-xl">
          <DialogHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-purple-primary" />
              <span className="text-2xl font-bold hero-text">
                Edu Management
              </span>
            </div>
            <DialogTitle>
              {type === 'login'
                ? 'Sign In to Your Account'
                : 'Create an Account'}
            </DialogTitle>
          </DialogHeader>

          {type === 'login' ? (
            <LoginForm
              onSuccess={handleSuccess}
              onSwitchToSignup={() => openAuthModal('signup')}
            />
          ) : (
            <SignupForm
              onSuccess={handleSuccess}
              onSwitchToLogin={() => openAuthModal('login')}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
