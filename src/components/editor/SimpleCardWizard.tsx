
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { WizardStepContent } from './wizard/WizardStepContent';
import { WizardProgressTracker } from './wizard/WizardProgressTracker';
import { useWizardState } from './wizard/useWizardState';
import type { CardData, DesignTemplate } from '@/hooks/useCardEditor';

interface SimpleCardWizardProps {
  onComplete: (cardData: CardData) => void;
  onBulkUpload?: () => void;
}

const wizardSteps = [
  { number: 1, title: 'Upload', description: 'Add your photo' },
  { number: 2, title: 'Template', description: 'Choose design' },
  { number: 3, title: 'Details', description: 'Add information' },
  { number: 4, title: 'Publish', description: 'Complete card' }
];

export const SimpleCardWizard = ({ onComplete, onBulkUpload }: SimpleCardWizardProps) => {
  const { wizardState, cardData, handlers, isSaving, templates } = useWizardState(onComplete);

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-crd-darkGray rounded-xl border border-crd-mediumGray/30 p-8 mb-6">
          <WizardStepContent
            currentStep={wizardState.currentStep}
            wizardState={wizardState}
            cardData={cardData}
            templates={templates}
            handlers={{...handlers, onBulkUpload}}
          />
        </div>

        {/* Progress Tracker */}
        <div className="mb-6">
          <WizardProgressTracker 
            currentStep={wizardState.currentStep}
            steps={wizardSteps}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlers.handleBack}
            disabled={wizardState.currentStep === 1}
            className="bg-transparent border-crd-lightGray text-crd-lightGray hover:bg-crd-lightGray hover:text-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex space-x-3">
            {wizardState.currentStep < 4 ? (
              <Button
                onClick={handlers.handleNext}
                className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
                disabled={isSaving}
              >
                {wizardState.currentStep === 1 && wizardState.aiAnalysisComplete && wizardState.selectedTemplate 
                  ? 'Skip to Details' 
                  : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handlers.handleComplete}
                className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
                disabled={isSaving}
              >
                {isSaving ? 'Creating...' : 'Create Card'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
