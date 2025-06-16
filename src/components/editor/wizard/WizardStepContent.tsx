
import React from 'react';
import { PhotoUploadStep } from './PhotoUploadStep';
import { TemplateSelectionStep } from './TemplateSelectionStep';
import { CardDetailsStep } from './CardDetailsStep';
import { PublishingOptionsStep } from './PublishingOptionsStep';
import { WizardProgressTracker } from './WizardProgressTracker';
import type { WizardState, WizardHandlers } from './types';
import type { CardData, DesignTemplate } from '@/hooks/useCardEditor';

interface WizardStepContentProps {
  currentStep: number;
  wizardState: WizardState;
  cardData: CardData;
  templates: DesignTemplate[];
  handlers: WizardHandlers & { onBulkUpload?: () => void };
}

const wizardSteps = [
  { number: 1, title: 'Upload Photo', description: 'Add your photo' },
  { number: 2, title: 'Choose Template', description: 'Choose design' },
  { number: 3, title: 'Card Details', description: 'Add information' },
  { number: 4, title: 'Publish', description: 'Complete card' }
];

export const WizardStepContent = ({ 
  currentStep, 
  wizardState, 
  cardData, 
  templates, 
  handlers 
}: WizardStepContentProps) => {
  return (
    <div>
      {/* Progress Tracker at the top */}
      <WizardProgressTracker 
        currentStep={currentStep}
        steps={wizardSteps}
      />

      {/* Step Content */}
      {currentStep === 1 && (
        <PhotoUploadStep
          selectedPhoto={wizardState.selectedPhoto}
          onPhotoSelect={handlers.handlePhotoSelect}
          onAnalysisComplete={handlers.handleAiAnalysis}
          onBulkUpload={handlers.onBulkUpload}
        />
      )}
      {currentStep === 2 && (
        <TemplateSelectionStep
          templates={templates}
          selectedTemplate={wizardState.selectedTemplate}
          onTemplateSelect={handlers.handleTemplateSelect}
        />
      )}
      {currentStep === 3 && (
        <CardDetailsStep
          cardData={cardData}
          onFieldUpdate={handlers.updateCardField}
          onCreatorAttributionUpdate={handlers.updateCreatorAttribution}
          aiAnalysisComplete={wizardState.aiAnalysisComplete}
        />
      )}
      {currentStep === 4 && (
        <PublishingOptionsStep
          publishingOptions={cardData.publishing_options}
          selectedTemplate={wizardState.selectedTemplate}
          onPublishingUpdate={handlers.updatePublishingOptions}
        />
      )}
    </div>
  );
};
