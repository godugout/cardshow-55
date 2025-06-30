
import React from 'react';
import { IntentStep } from './steps/IntentStep';
import { LayerControlStudio } from './steps/LayerControlStudio';
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
  onPhotoSelect?: (photo: string) => void;
  onFieldUpdate?: (field: keyof CardData, value: any) => void;
  onBulkUpload?: () => void;
  onNextStep?: () => void;
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
  onNextStep,
  onGoToGallery,
  onStartOver
}: StepContentProps) => {
  console.log('🎯 StepContent: Rendering step:', step, 'with mode:', mode);

  switch (step) {
    case 'intent':
      return (
        <IntentStep
          onModeSelect={onModeSelect}
          onBulkUpload={onBulkUpload || (() => {})}
        />
      );

    case 'upload':
      if (mode === 'bulk') {
        return (
          <LayerControlStudio
            onNext={onNextStep}
          />
        );
      } else {
        // Simple upload step for other modes
        return (
          <div className="text-center py-8">
            <div className="max-w-md mx-auto">
              <h3 className="text-crd-white text-xl font-semibold mb-4">
                Upload Your Image
              </h3>
              <p className="text-crd-lightGray mb-6">
                Choose an image to create your card from
              </p>
              <button 
                onClick={onNextStep} 
                className="px-6 py-3 bg-crd-green text-black rounded font-medium hover:bg-crd-green/80 transition-colors"
              >
                Continue to Details
              </button>
            </div>
          </div>
        );
      }

    case 'details':
      return (
        <div className="text-center py-8">
          <div className="max-w-md mx-auto">
            <h3 className="text-crd-white text-xl font-semibold mb-4">
              Card Details
            </h3>
            <p className="text-crd-lightGray mb-6">
              Add title, description, and other details for your card
            </p>
            <button 
              onClick={onNextStep} 
              className="px-6 py-3 bg-crd-green text-black rounded font-medium hover:bg-crd-green/80 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      );

    case 'design':
      return (
        <div className="text-center py-8">
          <div className="max-w-md mx-auto">
            <h3 className="text-crd-white text-xl font-semibold mb-4">
              Design Your Card
            </h3>
            <p className="text-crd-lightGray mb-6">
              Choose templates, colors, and customize the appearance
            </p>
            <button 
              onClick={onNextStep} 
              className="px-6 py-3 bg-crd-green text-black rounded font-medium hover:bg-crd-green/80 transition-colors"
            >
              Continue to Publish
            </button>
          </div>
        </div>
      );

    case 'publish':
      return (
        <div className="text-center py-8">
          <div className="max-w-md mx-auto">
            <h3 className="text-crd-white text-xl font-semibold mb-4">
              Publish Your Card
            </h3>
            <p className="text-crd-lightGray mb-6">
              Review and publish your card to your collection
            </p>
            <button 
              onClick={onNextStep} 
              className="px-6 py-3 bg-crd-green text-black rounded font-medium hover:bg-crd-green/80 transition-colors"
            >
              Create Card
            </button>
          </div>
        </div>
      );

    case 'complete':
      return (
        <div className="text-center py-8">
          <div className="max-w-md mx-auto">
            <h3 className="text-crd-white text-xl font-semibold mb-4">
              Card Created Successfully!
            </h3>
            <p className="text-crd-lightGray mb-6">
              Your card has been created and added to your collection
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={onGoToGallery} 
                className="px-6 py-3 bg-crd-green text-black rounded font-medium hover:bg-crd-green/80 transition-colors"
              >
                View Gallery
              </button>
              <button 
                onClick={onStartOver} 
                className="px-6 py-3 border border-crd-mediumGray text-crd-white rounded font-medium hover:bg-crd-mediumGray/10 transition-colors"
              >
                Create Another
              </button>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="text-center py-8">
          <p className="text-crd-lightGray">Unknown step: {step}</p>
        </div>
      );
  }
};
