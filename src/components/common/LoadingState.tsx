
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  timeout?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  size = 'md', 
  fullPage = false,
  timeout = 15000 // Reduced from 30s to 15s
}) => {
  const [timedOut, setTimedOut] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      console.warn('LoadingState: Timeout reached for:', message);
      setTimedOut(true);
    }, timeout);
    
    return () => clearTimeout(timer);
  }, [timeout, message]);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const containerClasses = fullPage 
    ? 'min-h-screen flex items-center justify-center bg-crd-darkest'
    : 'flex items-center justify-center p-8';

  if (timedOut) {
    return (
      <div className={containerClasses}>
        <div className="flex flex-col items-center space-y-4 max-w-md text-center">
          <div className="text-red-400 text-lg">⚠️</div>
          <h3 className="text-white text-lg">Loading timed out</h3>
          <p className="text-crd-lightGray text-sm">The content is taking longer than expected to load.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-crd-green hover:bg-crd-green/90 text-white px-4 py-2 rounded text-sm"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-crd-green`} />
        <p className="text-crd-lightGray text-center">{message}</p>
      </div>
    </div>
  );
};
