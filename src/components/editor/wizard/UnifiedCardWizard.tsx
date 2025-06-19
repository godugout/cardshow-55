
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WizardStepIndicator } from './WizardStepIndicator';
import { WizardHeader } from './WizardHeader';
import { WizardNavigation } from './WizardNavigation';
import { UnifiedPhotoUploadStep } from './steps/UnifiedPhotoUploadStep';
import { UnifiedTemplateSelectionStep } from './steps/UnifiedTemplateSelectionStep';
import { UnifiedCardDetailsStep } from './steps/UnifiedCardDetailsStep';
import { UnifiedPublishingOptionsStep } from './steps/UnifiedPublishingOptionsStep';
import { useWizardState } from './useWizardState';
import { WIZARD_STEPS } from './wizardConfig';
import type { EnhancedCardWizardProps } from './types';

export type WizardMode = 'quick' | 'advanced' | 'bulk';

interface UnifiedCardWizardProps extends EnhancedCardWizardProps {
  mode: WizardMode;
}

export const UnifiedCardWizard = ({ onComplete, onCancel, mode }: UnifiedCardWizardProps) => {
  const { wizardState, cardData, handlers, isSaving, templates, updateCardField } = useWizardState(onComplete);

  const handleFieldUpdate = <K extends keyof typeof cardData>(field: K, value: typeof cardData[K]) => {
    updateCardField(field, value);
  };

  // Mode-specific step configuration
  const getStepsForMode = () => {
    if (mode === 'bulk') {
      return [
        { number: 1, title: 'Upload Images', description: 'Select multiple images for batch processing' },
        { number: 2, title: 'Auto-Process', description: 'AI analyzes and creates cards automatically' },
        { number: 3, title: 'Review & Edit', description: 'Review generated cards and make adjustments' },
        { number: 4, title: 'Publish Collection', description: 'Publish your card collection' }
      ];
    }
    return WIZARD_STEPS;
  };

  const renderStepContent = () => {
    if (mode === 'bulk') {
      // Bulk mode has different step flow
      switch (wizardState.currentStep) {
        case 1:
          return <div>Bulk upload component coming soon</div>;
        default:
          return <div>Bulk step {wizardState.currentStep}</div>;
      }
    }

    // Standard flow for quick and advanced modes
    switch (wizardState.currentStep) {
      case 1:
        return (
          <UnifiedPhotoUploadStep
            mode={mode}
            selectedPhoto={wizardState.selectedPhoto}
            onPhotoSelect={handlers.handlePhotoSelect}
            onAnalysisComplete={handlers.handleAiAnalysis}
          />
        );
      case 2:
        return (
          <UnifiedTemplateSelectionStep
            mode={mode}
            templates={templates}
            selectedTemplate={wizardState.selectedTemplate}
            onTemplateSelect={handlers.handleTemplateSelect}
          />
        );
      case 3:
        return (
          <UnifiedCardDetailsStep
            mode={mode}
            cardData={cardData}
            onFieldUpdate={handleFieldUpdate}
            onCreatorAttributionUpdate={handlers.updateCreatorAttribution}
            aiAnalysisComplete={wizardState.aiAnalysisComplete}
          />
        );
      case 4:
        return (
          <UnifiedPublishingOptionsStep
            mode={mode}
            publishingOptions={cardData.publishing_options}
            selectedTemplate={wizardState.selectedTemplate}
            onPublishingUpdate={handlers.updatePublishingOptions}
          />
        );
      default:
        return null;
    }
  };

  // Mode-specific navigation behavior
  const canSkipToEnd = mode === 'quick' && wizardState.aiAnalysisComplete && !!wizardState.selectedTemplate;

  return (
    <div className="min-h-screen bg-editor-darker p-6">
      <div className="max-w-4xl mx-auto">
        <WizardHeader 
          mode={mode}
          aiAnalysisComplete={wizardState.aiAnalysisComplete} 
        />
        
        <WizardStepIndicator 
          steps={getStepsForMode()} 
          currentStep={wizardState.currentStep} 
        />

        <Card className="bg-editor-dark border-editor-border">
          <CardContent className="p-8">
            {renderStepContent()}

            <WizardNavigation
              currentStep={wizardState.currentStep}
              totalSteps={getStepsForMode().length}
              isLastStep={wizardState.currentStep === getStepsForMode().length}
              isSaving={isSaving}
              onCancel={onCancel}
              onBack={handlers.handleBack}
              onNext={() => handlers.handleNext()}
              onComplete={handlers.handleComplete}
              canSkipToEnd={canSkipToEnd}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
