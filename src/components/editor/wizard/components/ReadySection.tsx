
import React from 'react';
import { Check } from 'lucide-react';

interface ReadySectionProps {
  selectedPhoto: string;
  isAnalyzing: boolean;
}

export const ReadySection = ({ selectedPhoto, isAnalyzing }: ReadySectionProps) => {
  if (!selectedPhoto || isAnalyzing) return null;

  return (
    <div className="bg-crd-darkGray border border-crd-mediumGray/30 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Check className="w-5 h-5 text-crd-green" />
        <h3 className="text-white font-semibold">Ready for Card Creation</h3>
      </div>
      <p className="text-crd-lightGray text-sm mb-6">
        Your image has been processed and optimized for the standard trading card format. 
        Use "Advanced Crop" to extract multiple elements (frame, logos, etc.) or proceed with the simple workflow.
      </p>
      
      {/* Features */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-white font-medium mb-2">Supported Formats & Features</h4>
          <div className="text-crd-lightGray text-sm space-y-1">
            <div>File Types:</div>
            <div>JPG, PNG, WebP, GIF</div>
          </div>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">Advanced Features:</h4>
          <div className="text-crd-lightGray text-sm space-y-1">
            <div>Multi-element cropping, Frame extraction</div>
          </div>
        </div>
      </div>
    </div>
  );
};
