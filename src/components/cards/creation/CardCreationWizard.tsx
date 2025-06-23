
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/types/card';
import { ImageUploadStep } from './steps/ImageUploadStep';
import { TemplateSelectionStep } from './steps/TemplateSelectionStep';
import { MetadataStep } from './steps/MetadataStep';
import { ReviewStep } from './steps/ReviewStep';

interface CardCreationWizardProps {
  onComplete: (card: Partial<Card>) => void;
  onCancel: () => void;
  initialData?: Partial<Card>;
}

const STEPS = [
  { id: 'image', title: 'Upload Image', description: 'Add your card artwork' },
  { id: 'template', title: 'Choose Template', description: 'Select a card layout' },
  { id: 'metadata', title: 'Card Details', description: 'Add title, description, and attributes' },
  { id: 'review', title: 'Review & Create', description: 'Final review before creating' }
];

export const CardCreationWizard: React.FC<CardCreationWizardProps> = ({
  onComplete,
  onCancel,
  initialData = {}
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [cardData, setCardData] = useState<Partial<Card>>(initialData);
  const [isValid, setIsValid] = useState(false);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(cardData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateCardData = (updates: Partial<Card>) => {
    setCardData(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'image':
        return (
          <ImageUploadStep
            cardData={cardData}
            onUpdate={updateCardData}
            onValidationChange={setIsValid}
          />
        );
      case 'template':
        return (
          <TemplateSelectionStep
            cardData={cardData}
            onUpdate={updateCardData}
            onValidationChange={setIsValid}
          />
        );
      case 'metadata':
        return (
          <MetadataStep
            cardData={cardData}
            onUpdate={updateCardData}
            onValidationChange={setIsValid}
          />
        );
      case 'review':
        return (
          <ReviewStep
            cardData={cardData}
            onUpdate={updateCardData}
            onValidationChange={setIsValid}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-crd-darker rounded-xl border border-crd-mediumGray/30 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-crd-mediumGray/30">
          <div>
            <h1 className="text-2xl font-bold text-white">Create New Card</h1>
            <p className="text-crd-lightGray">
              {STEPS[currentStep].title} - {STEPS[currentStep].description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-crd-lightGray hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-crd-mediumGray/30">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index < STEPS.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${index <= currentStep 
                      ? 'bg-crd-green text-black' 
                      : 'bg-crd-mediumGray text-crd-lightGray'
                    }
                  `}
                >
                  {index + 1}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`
                      flex-1 h-0.5 mx-4
                      ${index < currentStep ? 'bg-crd-green' : 'bg-crd-mediumGray'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-crd-lightGray text-sm">
              Step {currentStep + 1} of {STEPS.length}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-crd-mediumGray/30 bg-crd-mediumGray/10">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="text-crd-lightGray text-sm">
            Use Tab to navigate between fields, Enter to continue
          </div>

          <Button
            onClick={handleNext}
            disabled={!isValid}
            className="bg-crd-green hover:bg-crd-green/90 text-black font-medium"
          >
            {currentStep === STEPS.length - 1 ? 'Create Card' : 'Next'}
            {currentStep < STEPS.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
