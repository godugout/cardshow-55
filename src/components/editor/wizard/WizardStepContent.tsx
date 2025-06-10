
import React from 'react';
import { PhotoUploadStep } from './PhotoUploadStep';
import { TemplateSelectionStep } from './TemplateSelectionStep';
import { CardDetailsStep } from './CardDetailsStep';
import { PublishingOptionsStep } from './PublishingOptionsStep';
import type { WizardState, WizardHandlers } from './types';
import type { CardData, DesignTemplate } from '@/hooks/useCardEditor';

interface WizardStepContentProps {
  currentStep: number;
  wizardState: WizardState;
  cardData: CardData;
  templates: DesignTemplate[];
  handlers: WizardHandlers;
}

export const WizardStepContent = ({ 
  currentStep, 
  wizardState, 
  cardData, 
  templates, 
  handlers 
}: WizardStepContentProps) => {
  switch (currentStep) {
    case 1:
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Upload Your Image</h2>
            <p className="text-crd-lightGray text-sm">Start by uploading the image for your card</p>
          </div>
          <PhotoUploadStep
            selectedPhoto={wizardState.selectedPhoto}
            onPhotoSelect={handlers.handlePhotoSelect}
            onAnalysisComplete={handlers.handleAiAnalysis}
          />
        </div>
      );
    case 2:
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Choose Template</h2>
            <p className="text-crd-lightGray text-sm">Select a template that fits your card style</p>
          </div>
          <TemplateSelectionStep
            templates={templates}
            selectedTemplate={wizardState.selectedTemplate}
            onTemplateSelect={handlers.handleTemplateSelect}
          />
        </div>
      );
    case 3:
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Add Details</h2>
            <p className="text-crd-lightGray text-sm">Customize your card with title and description</p>
          </div>
          <CardDetailsStep
            cardData={cardData}
            onFieldUpdate={handlers.updateCardField}
            onCreatorAttributionUpdate={handlers.updateCreatorAttribution}
            aiAnalysisComplete={wizardState.aiAnalysisComplete}
          />
        </div>
      );
    case 4:
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Publishing Options</h2>
            <p className="text-crd-lightGray text-sm">Choose how to share your card</p>
          </div>
          <PublishingOptionsStep
            publishingOptions={cardData.publishing_options}
            selectedTemplate={wizardState.selectedTemplate}
            onPublishingUpdate={handlers.updatePublishingOptions}
          />
        </div>
      );
    default:
      return null;
  }
};
