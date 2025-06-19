
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WizardStepIndicator } from './WizardStepIndicator';
import { WizardHeader } from './WizardHeader';
import { WizardNavigation } from './WizardNavigation';
import { UnifiedUploadAndFrameStep } from './steps/UnifiedUploadAndFrameStep';
import { CropPositionStep } from './steps/CropPositionStep';
import { EffectsStylingStep } from './steps/EffectsStylingStep';
import { UnifiedCardDetailsStep } from './steps/UnifiedCardDetailsStep';
import { useWizardState } from './useWizardState';
import { WIZARD_STEPS, BULK_WIZARD_STEPS } from './wizardConfig';
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
      return BULK_WIZARD_STEPS;
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
          <UnifiedUploadAndFrameStep
            mode={mode}
            selectedPhoto={wizardState.selectedPhoto}
            onPhotoSelect={handlers.handlePhotoSelect}
            onAnalysisComplete={handlers.handleAiAnalysis}
            templates={templates}
            selectedTemplate={wizardState.selectedTemplate}
            onTemplateSelect={handlers.handleTemplateSelect}
          />
        );
      case 2:
        return (
          <CropPositionStep
            selectedPhoto={wizardState.selectedPhoto}
            selectedTemplate={wizardState.selectedTemplate}
            onCropComplete={(croppedImage) => {
              handlers.handlePhotoSelect(croppedImage);
            }}
          />
        );
      case 3:
        return (
          <EffectsStylingStep
            selectedTemplate={wizardState.selectedTemplate}
            selectedPhoto={wizardState.selectedPhoto}
            onEffectsUpdate={(effects) => {
              updateCardField('design_metadata', {
                ...cardData.design_metadata,
                effects
              });
            }}
          />
        );
      case 4:
        return (
          <UnifiedCardDetailsStep
            mode={mode}
            cardData={cardData}
            onFieldUpdate={handleFieldUpdate}
            onCreatorAttributionUpdate={handlers.updateCreatorAttribution}
            onPublishingUpdate={handlers.updatePublishingOptions}
            aiAnalysisComplete={wizardState.aiAnalysisComplete}
          />
        );
      default:
        return null;
    }
  };

  // Validation for navigation
  const canProceedToNext = () => {
    switch (wizardState.currentStep) {
      case 1:
        return wizardState.selectedPhoto && wizardState.selectedTemplate;
      case 2:
        return wizardState.selectedPhoto; // Crop step - photo should be present
      case 3:
        return true; // Effects step - always can proceed (effects are optional)
      case 4:
        return cardData.title && cardData.title.trim().length > 0;
      default:
        return true;
    }
  };

  const getValidationMessage = () => {
    switch (wizardState.currentStep) {
      case 1:
        if (!wizardState.selectedPhoto) return 'Please upload a photo first';
        if (!wizardState.selectedTemplate) return 'Please select a frame for your card';
        return '';
      case 2:
        return ''; // Crop step doesn't require validation
      case 3:
        return ''; // Effects step doesn't require validation
      case 4:
        if (!cardData.title || !cardData.title.trim()) return 'Please enter a title for your card';
        return '';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-editor-darker p-6">
      <div className="max-w-6xl mx-auto">
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
              onNext={() => {
                const validationMessage = getValidationMessage();
                if (canProceedToNext()) {
                  handlers.handleNext();
                } else if (validationMessage) {
                  alert(validationMessage);
                }
              }}
              onComplete={handlers.handleComplete}
              canSkipToEnd={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
