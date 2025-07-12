import React from 'react';

interface CRDGradientLogoProps {
  className?: string;
}

export const CRDGradientLogo: React.FC<CRDGradientLogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center relative ${className}`}>
      <div className="relative">
        {/* Blue to Purple Gradient Layer */}
        <div className="absolute inset-0 crd-gradient-blue-purple rounded-lg opacity-60 blur-sm"></div>
        
        {/* Orange to Blue Gradient Layer */}
        <div className="absolute inset-0 crd-gradient-orange-blue rounded-lg opacity-40 mix-blend-overlay"></div>
        
        {/* Logo Image */}
        <img 
          src="/lovable-uploads/be11e2e9-fa4f-4191-b338-a9a24e7ce7df.png" 
          alt="CRD"
          className="h-20 w-auto relative z-10"
        />
      </div>
      <span className="text-lg font-orbitron font-semibold text-themed-secondary tracking-wider relative z-10 -ml-1 transition-colors duration-300 drop-shadow-sm">
        MKR
      </span>
    </div>
  );
};