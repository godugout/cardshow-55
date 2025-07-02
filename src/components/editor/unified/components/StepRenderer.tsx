
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreationMode, CreationStep } from '../types';
import type { CardData } from '@/hooks/useCardEditor';

// Import step components
import { IntentStep } from './steps/IntentStep';
import { PhotoStep } from './steps/PhotoStep';
import { DetailsStep } from './steps/DetailsStep';
import { DesignStep } from './steps/DesignStep';
import { PublishStep } from './steps/PublishStep';
import { CompleteStep } from './steps/CompleteStep';

interface StepRendererProps {
  currentStep: CreationStep;
  selectedMode: CreationMode;
  cardData: CardData;
  onModeSelect: (mode: CreationMode) => void;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
  onStartOver: () => void;
}

export const StepRenderer = ({
  currentStep,
  selectedMode,
  cardData,
  onModeSelect,
  onFieldUpdate,
  onStartOver
}: StepRendererProps) => {
  const navigate = useNavigate();

  switch (currentStep) {
    case 'intent':
      return (
        <IntentStep
          onModeSelect={onModeSelect}
          onBulkUpload={() => navigate('/cards/bulk-upload')}
        />
      );
    case 'upload':
      return (
        <PhotoStep
          mode={selectedMode}
          selectedPhoto={cardData.image_url}
          onPhotoSelect={(photo) => onFieldUpdate('image_url', photo)}
          cardData={cardData}
        />
      );
    case 'details':
      return (
        <DetailsStep
          mode={selectedMode}
          cardData={cardData}
          onFieldUpdate={onFieldUpdate}
        />
      );
    case 'design':
      return (
        <DesignStep
          mode={selectedMode}
          cardData={cardData}
          onFieldUpdate={onFieldUpdate}
        />
      );
    case 'publish':
      return (
        <PublishStep
          mode={selectedMode}
          cardData={cardData}
          onFieldUpdate={onFieldUpdate}
        />
      );
    case 'complete':
      return (
        <CompleteStep
          mode={selectedMode}
          cardData={cardData}
          onGoToGallery={() => navigate('/gallery')}
          onStartOver={onStartOver}
        />
      );
    default:
      return <div>Unknown step</div>;
  }
};
