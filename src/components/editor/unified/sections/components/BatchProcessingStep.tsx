
import React from 'react';
import { Grid } from 'lucide-react';

interface BatchProcessingStepProps {
  imageUrl?: string;
}

export const BatchProcessingStep: React.FC<BatchProcessingStepProps> = ({ imageUrl }) => {
  return (
    <div className="text-center space-y-6">
      <div className="bg-gradient-to-r from-crd-green/10 to-crd-blue/10 border border-crd-green/30 rounded-xl p-8">
        <Grid className="w-16 h-16 text-crd-green mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-crd-white mb-2">Batch Processing Ready</h3>
        <p className="text-crd-lightGray mb-4">
          Your image is ready for batch processing. Continue to apply effects and finalize your cards.
        </p>
        {imageUrl && (
          <div className="max-w-xs mx-auto">
            <img 
              src={imageUrl} 
              alt="Uploaded for batch processing"
              className="w-full rounded-lg border border-crd-mediumGray/30"
            />
          </div>
        )}
      </div>
    </div>
  );
};
