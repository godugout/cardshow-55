
import React from 'react';
import { Typography } from '@/components/ui/design-system';

export const CreateHeroDecorations: React.FC = () => {
  return (
    <>
      {/* CRD Card - Top Left */}
      <div className="absolute top-16 left-8 md:top-20 md:left-16 animate-pulse">
        <div className="relative transform rotate-12 hover:rotate-6 transition-transform duration-700">
          <div className="w-20 h-28 md:w-24 md:h-32 bg-gradient-to-br from-crd-green/20 to-crd-blue/20 rounded-lg border border-crd-green/30 backdrop-blur-sm shadow-lg">
            <div className="flex items-center justify-center h-full">
              <Typography variant="small-heading" className="text-crd-green font-extrabold">
                CRD
              </Typography>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-crd-green/10 to-crd-blue/10 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* STRY Card - Top Right */}
      <div className="absolute top-24 right-8 md:top-32 md:right-16 animate-pulse delay-1000">
        <div className="relative transform -rotate-12 hover:-rotate-6 transition-transform duration-700">
          <div className="w-20 h-28 md:w-24 md:h-32 bg-gradient-to-br from-crd-purple/20 to-crd-orange/20 rounded-lg border border-crd-purple/30 backdrop-blur-sm shadow-lg">
            <div className="flex items-center justify-center h-full">
              <Typography variant="small-heading" className="text-crd-purple font-extrabold">
                STRY
              </Typography>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-crd-purple/10 to-crd-orange/10 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Additional floating CRD Card - Bottom Left */}
      <div className="absolute bottom-32 left-4 md:bottom-40 md:left-12 animate-pulse delay-2000">
        <div className="relative transform rotate-6 hover:rotate-12 transition-transform duration-700">
          <div className="w-16 h-24 md:w-20 md:h-28 bg-gradient-to-br from-crd-blue/15 to-crd-green/15 rounded-lg border border-crd-blue/25 backdrop-blur-sm shadow-md">
            <div className="flex items-center justify-center h-full">
              <Typography variant="caption" className="text-crd-blue font-bold">
                CRD
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Additional floating STRY Card - Bottom Right */}
      <div className="absolute bottom-40 right-4 md:bottom-48 md:right-12 animate-pulse delay-3000">
        <div className="relative transform -rotate-6 hover:-rotate-12 transition-transform duration-700">
          <div className="w-16 h-24 md:w-20 md:h-28 bg-gradient-to-br from-crd-orange/15 to-crd-purple/15 rounded-lg border border-crd-orange/25 backdrop-blur-sm shadow-md">
            <div className="flex items-center justify-center h-full">
              <Typography variant="caption" className="text-crd-orange font-bold">
                STRY
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
