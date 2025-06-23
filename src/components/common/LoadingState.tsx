
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  timeout?: number; // Add timeout option
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  size = 'md', 
  fullPage = false,
  timeout = 30000 // 30 second default timeout
}) => {
  const [timedOut, setTimedOut] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, timeout);
    
    return () => clearTimeout(timer);
  }, [timeout]);
  
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
        <div className="flex flex-col items-center space-y-4">
          <div className="text-red-400 text-lg">⚠️</div>
          <p className="text-crd-lightGray text-center">Loading timed out</p>
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
