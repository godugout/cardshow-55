
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { WizardHeader } from './wizard/WizardHeader';
import { WizardStepContent } from './wizard/WizardStepContent';
import { useWizardState } from './wizard/useWizardState';
import type { CardData, DesignTemplate } from '@/hooks/useCardEditor';

interface SimpleCardWizardProps {
  onComplete: (cardData: CardData) => void;
}

export const SimpleCardWizard = ({ onComplete }: SimpleCardWizardProps) => {
  const { wizardState, cardData, handlers, isSaving, templates } = useWizardState(onComplete);

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Create New Card</h1>
          <div className="text-crd-lightGray text-sm">
            Upload your image and let AI suggest the perfect details
            {wizardState.aiAnalysisComplete && <span className="text-crd-green ml-2">✨ AI analysis complete!</span>}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3, 4].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    wizardState.currentStep >= step 
                      ? 'bg-crd-green text-black' 
                      : 'bg-crd-mediumGray text-crd-lightGray'
                  }`}>
                    {wizardState.currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  <div className="text-white text-sm mt-2 text-center">
                    {step === 1 && 'Upload Photo'}
                    {step === 2 && 'Choose Template'}
                    {step === 3 && 'Card Details'}
                    {step === 4 && 'Publish'}
                  </div>
                </div>
                {index < 3 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    wizardState.currentStep > step ? 'bg-crd-green' : 'bg-crd-mediumGray'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <span className="text-crd-lightGray text-sm">
              Step {wizardState.currentStep} of 4
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-crd-darkGray rounded-xl border border-crd-mediumGray/30 p-8 mb-6">
          <WizardStepContent
            currentStep={wizardState.currentStep}
            wizardState={wizardState}
            cardData={cardData}
            templates={templates}
            handlers={handlers}
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
