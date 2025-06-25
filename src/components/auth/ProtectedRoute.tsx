
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { AuthForm } from './AuthForm';
import { LoadingState } from '@/components/common/LoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [showTimeout, setShowTimeout] = useState(false);

  // Add timeout fallback to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading && !user) {
        console.warn('ProtectedRoute: Loading timeout reached');
        setShowTimeout(true);
      }
    }, 8000); // Reduced to 8 seconds

    return () => clearTimeout(timer);
  }, [loading, user]);

  // Clear timeout when loading completes
  useEffect(() => {
    if (!loading) {
      setShowTimeout(false);
    }
  }, [loading]);

  // Show timeout error if loading takes too long
  if (showTimeout) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="text-red-400 text-lg mb-4">⚠️</div>
          <h2 className="text-white text-xl mb-2">Authentication timeout</h2>
          <p className="text-crd-lightGray mb-4">The authentication is taking longer than expected.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-crd-green hover:bg-crd-green/90 text-white px-4 py-2 rounded"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <LoadingState 
        message="Authenticating..." 
        size="lg" 
        fullPage={true}
        timeout={8000}
      />
    );
  }

  // Show auth form if no user
  if (!user) {
    return <AuthForm />;
  }

  // Show protected content
  return <>{children}</>;
};
