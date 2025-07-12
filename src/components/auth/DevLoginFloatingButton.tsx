import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, X } from 'lucide-react';
import { devAuthService } from '@/features/auth/services/devAuthService';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { toast } from 'sonner';

export const DevLoginFloatingButton: React.FC = () => {
  const { user } = useAuth();
  const [isMinimized, setIsMinimized] = useState(false);

  const handleDevLogin = () => {
    try {
      console.log('🔧 Floating dev login triggered...');
      const result = devAuthService.forceCreateDevSession();
      if (result.error) {
        console.error('🔧 Dev session creation failed:', result.error);
        toast.error('Dev login failed: ' + result.error.message);
      } else {
        console.log('🔧 Dev session created successfully');
        toast.success('Dev user logged in successfully!');
        // Force reload to pick up the new auth state
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      console.error('🔧 Dev login error:', error);
      toast.error('Dev login failed: ' + (error as Error).message);
    }
  };

  // Only show in development and when not logged in
  if (process.env.NODE_ENV !== 'development' || user) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isMinimized ? (
        <Button
          onClick={() => setIsMinimized(false)}
          size="sm"
          className="bg-crd-blue hover:bg-crd-blue/80 text-white shadow-lg"
        >
          <User className="w-4 h-4" />
        </Button>
      ) : (
        <div className="bg-crd-darkGray border border-crd-mediumGray rounded-lg p-3 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-crd-lightGray font-semibold">DEV MODE</span>
            <Button
              onClick={() => setIsMinimized(true)}
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 text-crd-lightGray hover:text-white"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <Button
            onClick={handleDevLogin}
            size="sm"
            className="w-full bg-crd-blue hover:bg-crd-blue/80 text-white"
          >
            <User className="w-4 h-4 mr-2" />
            Quick Login
          </Button>
          <p className="text-xs text-crd-lightGray/70 mt-1 text-center">
            Development only
          </p>
        </div>
      )}
    </div>
  );
};