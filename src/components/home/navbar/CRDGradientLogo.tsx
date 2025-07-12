import React from 'react';

interface CRDGradientLogoProps {
  className?: string;
}

export const CRDGradientLogo: React.FC<CRDGradientLogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center relative ${className}`}>
      <img 
        src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
        alt="CRD"
        className="h-16 w-auto"
      />
      {/* Position MKR to overlay where the caret appears, hide on group hover */}
      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-lg font-medium text-crd-lightGray tracking-wide transition-opacity duration-300 group-hover:opacity-0">
        MKR
      </span>
    </div>
  );
};