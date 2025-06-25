
import React from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { AuthForm } from './AuthForm';
import { Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-crd-green animate-spin mx-auto mb-4" />
          <p className="text-crd-lightGray">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return <>{children}</>;
};
