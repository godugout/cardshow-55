
import React from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { CRDMKRLayout } from '@/components/crdmkr/CRDMKRLayout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const CRDMKRPage = () => {
  const { user } = useAuth();

  // Redirect to auth if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-crd-white mb-4">Authentication Required</h2>
          <p className="text-crd-lightGray mb-6">Please sign in to access CRDMKR template generator.</p>
          <a 
            href="/auth/signin" 
            className="inline-block bg-crd-green text-black px-6 py-3 rounded-lg font-semibold hover:bg-crd-green/80 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-crd-darkest">
        <CRDMKRLayout />
      </div>
    </ErrorBoundary>
  );
};

export default CRDMKRPage;
