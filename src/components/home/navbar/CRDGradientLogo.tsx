import React from 'react';

interface CRDGradientLogoProps {
  className?: string;
}

export const CRDGradientLogo: React.FC<CRDGradientLogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="text-2xl font-black bg-gradient-to-r from-crd-blue via-crd-lightBlue to-crd-blue bg-clip-text text-transparent tracking-tight">
        CRD
      </span>
      <span className="text-lg font-medium text-crd-lightGray tracking-wide">
        MKR
      </span>
    </div>
  );
};