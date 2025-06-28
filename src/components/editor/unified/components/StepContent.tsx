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
  cardData?: CardData;
  onModeSelect: (mode: CreationMode) => void;
  onPhotoSelect: (photo: string) => void;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
  onBulkUpload: () => void;
  onGoToGallery: () => void;
  onStartOver: () => void;
  selectedFrame?: import('@/types/card').DesignTemplate;
  onFrameSelect?: (frame: import('@/types/card').DesignTemplate) => void;
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
  onStartOver,
  selectedFrame,
  onFrameSelect
}: StepContentProps) => {
  console.log('🎯 StepContent: Rendering step:', step, 'with mode:', mode);

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
          selectedPhoto={cardData?.image_url}
          onPhotoSelect={onPhotoSelect}
          cardData={cardData}
          selectedFrame={selectedFrame}
          onFrameSelect={onFrameSelect}
        />
      );

    case 'details':
      if (!cardData) {
        return (
          <div className="text-center py-8">
            <p className="text-crd-lightGray">Loading card data...</p>
          </div>
        );
      }
      return (
        <DetailsStep
          mode={mode}
          cardData={cardData}
          onFieldUpdate={onFieldUpdate}
        />
      );

    case 'design':
      if (!cardData) {
        return (
          <div className="text-center py-8">
            <p className="text-crd-lightGray">Loading card data...</p>
          </div>
        );
      }
      return (
        <DesignStep
          mode={mode}
          cardData={cardData}
          onFieldUpdate={onFieldUpdate}
        />
      );

    case 'publish':
      if (!cardData) {
        return (
          <div className="text-center py-8">
            <p className="text-crd-lightGray">Loading card data...</p>
          </div>
        );
      }
      return (
        <PublishStep
          mode={mode}
          cardData={cardData}
          onFieldUpdate={onFieldUpdate}
        />
      );

    case 'complete':
      if (!cardData) {
        return (
          <div className="text-center py-8">
            <p className="text-crd-lightGray">Loading completion data...</p>
          </div>
        );
      }
      return (
        <CompleteStep
          mode={mode}
          cardData={cardData}
          onGoToGallery={onGoToGallery}
          onStartOver={onStartOver}
        />
      );

    default:
      return (
        <div className="text-center py-8">
          <p className="text-crd-lightGray">Unknown step: {step}</p>
        </div>
      );
  }
};
