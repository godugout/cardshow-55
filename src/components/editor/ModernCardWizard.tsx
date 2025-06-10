
import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { CardCreationButton } from '@/components/ui/card-creation-button';
import { WizardStepContent } from './wizard/WizardStepContent';
import { useWizardState } from './wizard/useWizardState';
import type { CardData } from '@/hooks/useCardEditor';

interface ModernCardWizardProps {
  onComplete: (cardData: CardData) => void;
  onBack: () => void;
}

export const ModernCardWizard = ({ onComplete, onBack }: ModernCardWizardProps) => {
  const { wizardState, cardData, handlers, isSaving, templates } = useWizardState(onComplete);

  const stepTitles = [
    'Upload Image',
    'Choose Template', 
    'Add Details',
    'Publish Options'
  ];

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="border-b border-editor-border bg-editor-dark">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardCreationButton
              variant="card-ghost"
              size="sm"
              onClick={onBack}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </CardCreationButton>
            <h1 className="text-xl font-semibold text-white">
              {stepTitles[wizardState.currentStep - 1]}
            </h1>
          </div>
          
          {/* Step indicator */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-crd-lightGray">
              {wizardState.currentStep} of {stepTitles.length}
            </span>
            <div className="flex space-x-1">
              {stepTitles.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index < wizardState.currentStep 
                      ? 'bg-crd-green' 
                      : index === wizardState.currentStep - 1
                      ? 'bg-crd-green/60'
                      : 'bg-crd-mediumGray'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Panel - Form */}
          <div className="bg-editor-dark rounded-2xl p-8 border border-crd-mediumGray/20">
            <WizardStepContent
              currentStep={wizardState.currentStep}
              wizardState={wizardState}
              cardData={cardData}
              templates={templates}
              handlers={handlers}
            />
          </div>

          {/* Right Panel - Card Preview */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-editor-dark rounded-2xl p-8 border border-crd-mediumGray/20">
              <div className="text-center space-y-6">
                <h3 className="text-lg font-semibold text-white">Card Preview</h3>
                
                {/* Card Preview Area */}
                <div className="aspect-[3/4] max-w-xs mx-auto bg-editor-canvas rounded-xl border border-crd-mediumGray/30 flex items-center justify-center">
                  {wizardState.selectedPhoto ? (
                    <img
                      src={wizardState.selectedPhoto}
                      alt="Card preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-crd-mediumGray/50 rounded-lg mx-auto"></div>
                      <p className="text-sm text-crd-lightGray">Upload an image to see preview</p>
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="space-y-2">
                  <h4 className="font-medium text-white">
                    {cardData.title || 'Card Title'}
                  </h4>
                  <p className="text-sm text-crd-lightGray">
                    {cardData.description || 'Card description will appear here'}
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      cardData.rarity === 'legendary' ? 'bg-yellow-600/20 text-yellow-400' :
                      cardData.rarity === 'epic' ? 'bg-purple-600/20 text-purple-400' :
                      cardData.rarity === 'rare' ? 'bg-blue-600/20 text-blue-400' :
                      cardData.rarity === 'uncommon' ? 'bg-green-600/20 text-green-400' :
                      'bg-gray-600/20 text-gray-400'
                    }`}>
                      {cardData.rarity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-editor-border">
          <div>
            {wizardState.currentStep > 1 && (
              <CardCreationButton
                variant="card-ghost"
                onClick={handlers.handleBack}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </CardCreationButton>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {wizardState.currentStep < 4 ? (
              <CardCreationButton
                variant="card-primary"
                onClick={handlers.handleNext}
                disabled={isSaving}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {wizardState.currentStep === 1 && wizardState.aiAnalysisComplete && wizardState.selectedTemplate 
                  ? 'Skip to Details' 
                  : 'Next'}
              </CardCreationButton>
            ) : (
              <CardCreationButton
                variant="card-primary"
                onClick={handlers.handleComplete}
                disabled={isSaving}
                icon={<Check className="w-4 h-4" />}
              >
                {isSaving ? 'Creating...' : 'Create Card'}
              </CardCreationButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
