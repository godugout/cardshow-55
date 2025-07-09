import React from 'react';

interface CRDGradientLogoProps {
  className?: string;
}

export const CRDGradientLogo: React.FC<CRDGradientLogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
        alt="CRD"
        className="h-5 w-auto"
      />
      <span className="text-lg font-medium text-crd-lightGray tracking-wide">
        MKR
      </span>
    </div>
  );
};