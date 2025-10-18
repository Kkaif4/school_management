import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-primary">
          403 - Access Forbidden
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Sorry, you don't have permission to access this page. Please contact
          your administrator if you believe this is a mistake.
        </p>
        <div className="space-x-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
