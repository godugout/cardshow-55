
import React from 'react';
import { CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import type { CardData } from '@/hooks/useCardEditor';

interface CompleteStepProps {
  cardData: CardData;
  onGoToGallery: () => void;
  onStartOver: () => void;
}

export const CompleteStep = ({ cardData, onGoToGallery, onStartOver }: CompleteStepProps) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-crd-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-crd-green" />
        </div>
        <h2 className="text-3xl font-bold text-crd-white mb-2">Card Created Successfully!</h2>
        <p className="text-crd-lightGray">
          Your card "{cardData.title}" has been created and saved to your collection.
        </p>
      </div>

      {cardData.image_url && (
        <div className="mb-8">
          <img 
            src={cardData.image_url} 
            alt={cardData.title}
            className="max-w-xs mx-auto rounded-lg border border-crd-mediumGray/20"
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <CRDButton
          onClick={onGoToGallery}
          variant="primary"
          className="bg-crd-green hover:bg-crd-green/80 text-black"
        >
          View in Gallery
          <ArrowRight className="w-4 h-4 ml-2" />
        </CRDButton>
        
        <CRDButton
          onClick={onStartOver}
          variant="outline"
          className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Create Another Card
        </CRDButton>
      </div>
    </div>
  );
};
