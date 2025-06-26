
import React from 'react';
import { IntentStep } from './steps/IntentStep';
import { PhotoStep } from './steps/PhotoStep';
import { DetailsStep } from './steps/DetailsStep';
import { DesignStep } from './steps/DesignStep';
import { PublishStep } from './steps/PublishStep';
import { CompleteStep } from './steps/CompleteStep';
import type { CreationStep, CreationMode } from '../types';
import type { CardData } from '@/hooks/useCardEditor';

interface StepContentProps {
  step: CreationStep;
  mode: CreationMode;
  cardData: CardData;
  onModeSelect: (mode: CreationMode) => void;
  onPhotoSelect: (photo: string) => void;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
  onBulkUpload: () => void;
  onGoToGallery: () => void;
  onStartOver: () => void;
}

export const StepContent = ({
  step,
  mode,
  cardData,
  onModeSelect,
  onPhotoSelect,
  onFieldUpdate,
  onBulkUpload,
  onGoToGallery,
  onStartOver
}: StepContentProps) => {
  switch (step) {
    case 'intent':
      return (
        <IntentStep
          onModeSelect={onModeSelect}
          onBulkUpload={onBulkUpload}
        />
      );
    
    case 'upload':
      return (
        <PhotoStep
          mode={mode}
          selectedPhoto={cardData.image_url}
          onPhotoSelect={onPhotoSelect}
        />
      );
    
    case 'details':
      return (
        <DetailsStep
          mode={mode}
          cardData={cardData}
          onFieldUpdate={onFieldUpdate}
        />
      );
    
    case 'design':
      return (
        <DesignStep
          mode={mode}
          cardData={cardData}
          onFieldUpdate={onFieldUpdate}
        />
      );
    
    case 'publish':
      return (
        <PublishStep
          mode={mode}
          cardData={cardData}
          onFieldUpdate={onFieldUpdate}
        />
      );
    
    case 'complete':
      return (
        <CompleteStep
          cardData={cardData}
          onGoToGallery={onGoToGallery}
          onStartOver={onStartOver}
        />
      );
    
    default:
      return <div className="text-center text-crd-lightGray">Step not found</div>;
  }
};
