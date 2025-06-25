
import React from 'react';
import { ModeSelector } from './ModeSelector';
import { PhotoUploadStep } from '../../wizard/PhotoUploadStep';
import { CardDetailsStep } from '../../wizard/CardDetailsStep';
import { PublishingOptionsStep } from '../../wizard/PublishingOptionsStep';
import { SimpleCardForm } from '../../SimpleCardForm';
import { SimpleEditor } from '../../SimpleEditor';
import BulkUpload from '@/pages/BulkUpload';
import type { CreationStep, CreationMode } from '../types';
import type { CardData } from '@/hooks/useCardEditor';

interface StepContentProps {
  step: CreationStep;
  mode: CreationMode;
  cardData: CardData;
  modeConfigs: any[];
  onModeSelect: (mode: CreationMode) => void;
  onPhotoSelect: (photo: string) => void;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
  onBulkUpload?: () => void;
}

export const StepContent = ({
  step,
  mode,
  cardData,
  modeConfigs,
  onModeSelect,
  onPhotoSelect,
  onFieldUpdate,
  onBulkUpload
}: StepContentProps) => {
  switch (step) {
    case 'intent':
      return (
        <ModeSelector
          configs={modeConfigs}
          selectedMode={mode}
          onModeSelect={onModeSelect}
        />
      );

    case 'upload':
      if (mode === 'bulk') {
        return <BulkUpload />;
      }
      return (
        <PhotoUploadStep
          selectedPhoto={cardData.image_url || ''}
          onPhotoSelect={onPhotoSelect}
          onBulkUpload={onBulkUpload}
        />
      );

    case 'details':
      if (mode === 'quick') {
        return <SimpleCardForm />;
      }
      return (
        <CardDetailsStep
          cardData={cardData}
          onFieldUpdate={onFieldUpdate}
          onCreatorAttributionUpdate={(key, value) => {
            onFieldUpdate('creator_attribution', {
              ...cardData.creator_attribution,
              [key]: value
            });
          }}
        />
      );

    case 'design':
      return (
        <SimpleEditor
          initialData={cardData}
          onStartOver={() => onModeSelect('quick')}
        />
      );

    case 'publish':
      return (
        <PublishingOptionsStep
          publishingOptions={cardData.publishing_options}
          selectedTemplate={null}
          onPublishingUpdate={(key, value) => {
            onFieldUpdate('publishing_options', {
              ...cardData.publishing_options,
              [key]: value
            });
          }}
        />
      );

    case 'complete':
      return (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-crd-green rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-crd-white mb-4">
              {mode === 'bulk' ? 'Cards Created Successfully!' : 'Card Created Successfully!'}
            </h2>
            <p className="text-crd-lightGray">
              {mode === 'bulk' 
                ? 'Your cards have been processed and are now available in your gallery.'
                : 'Your card has been created and is ready to share with the world.'
              }
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
};
