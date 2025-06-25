
import React from 'react';

export const LoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <img 
            src="/crd-logo-gradient.png" 
            alt="Cardshow" 
            className="w-16 h-16 mx-auto mb-4 animate-pulse"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#00C851] to-[#00A843] rounded-lg opacity-20 animate-ping" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Loading Cardshow</h2>
        <p className="text-crd-lightGray">Preparing your experience...</p>
        <div className="mt-4 w-32 h-1 bg-crd-mediumGray rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#00C851] to-[#00A843] rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};
