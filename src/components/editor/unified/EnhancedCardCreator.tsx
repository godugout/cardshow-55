
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardEditor } from '@/hooks/useCardEditor';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent } from '@/components/ui/card';
import { StepIndicator } from './components/StepIndicator';
import { StepContent } from './components/StepContent';
import { IntentStep } from './components/steps/IntentStep';
import { PhotoStep } from './components/steps/PhotoStep';
import { WIZARD_STEPS } from '@/components/editor/wizard/wizardConfig';
import type { CreationMode, CreationStep } from './types';
import type { DesignTemplate } from '@/types/card';

interface EnhancedCardCreatorProps {
  onComplete: (cardData: import('@/hooks/useCardEditor').CardData) => void;
  onCancel: () => void;
}

export const EnhancedCardCreator = ({ onComplete, onCancel }: EnhancedCardCreatorProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CreationStep>('intent');
  const [selectedMode, setSelectedMode] = useState<CreationMode>('quick');
  const cardEditor = useCardEditor();
  const [selectedFrame, setSelectedFrame] = useState<DesignTemplate | undefined>();

  const handleModeSelect = (mode: CreationMode) => {
    setSelectedMode(mode);
    setCurrentStep('upload');
  };

  const handleFrameSelect = (frame: DesignTemplate) => {
    setSelectedFrame(frame);
    cardEditor.updateCardField('template_id', frame.id);
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'intent':
        setCurrentStep('upload');
        break;
      case 'upload':
        setCurrentStep('details');
        break;
      case 'details':
        setCurrentStep('design');
        break;
      case 'design':
        setCurrentStep('publish');
        break;
      case 'publish':
        setCurrentStep('complete');
        break;
      default:
        console.warn('Unknown step:', currentStep);
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'upload':
        setCurrentStep('intent');
        break;
      case 'details':
        setCurrentStep('upload');
        break;
      case 'design':
        setCurrentStep('details');
        break;
      case 'publish':
        setCurrentStep('design');
        break;
      case 'complete':
        setCurrentStep('publish');
        break;
      default:
        console.warn('Unknown step:', currentStep);
    }
  };

  const handleStartOver = useCallback(() => {
    setCurrentStep('intent');
    setSelectedMode('quick');
    cardEditor.updateCardField('image_url', '');
  }, [cardEditor]);

  const handleComplete = async () => {
    console.log('Completing card creation...');
    await cardEditor.saveCard();
    onComplete(cardEditor.cardData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'intent':
        return (
          <IntentStep
            onModeSelect={handleModeSelect}
            onBulkUpload={() => navigate('/cards/bulk-upload')}
          />
        );

      case 'upload':
        return (
          <PhotoStep
            mode={selectedMode}
            selectedPhoto={cardEditor.cardData.image_url}
            onPhotoSelect={(photo) => cardEditor.updateCardField('image_url', photo)}
            cardData={cardEditor.cardData}
            selectedFrame={selectedFrame}
            onFrameSelect={handleFrameSelect}
          />
        );

      case 'details':
      case 'design':
      case 'publish':
      case 'complete':
        return (
          <StepContent
            step={currentStep}
            mode={selectedMode}
            cardData={cardEditor.cardData}
            onModeSelect={handleModeSelect}
            onPhotoSelect={(photo) => cardEditor.updateCardField('image_url', photo)}
            onFieldUpdate={cardEditor.updateCardField}
            onBulkUpload={() => navigate('/cards/bulk-upload')}
            onGoToGallery={() => navigate('/gallery')}
            onStartOver={handleStartOver}
          />
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-5xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-crd-white text-center mb-8">
          Create Your Card
        </h1>

        <StepIndicator steps={WIZARD_STEPS} currentStep={currentStep} />

        <Card className="bg-crd-darker border-crd-mediumGray/20 mt-8">
          <CardContent className="p-8">
            {renderStepContent()}

            <div className="flex justify-between mt-8">
              <CRDButton
                variant="secondary"
                onClick={onCancel}
              >
                Cancel
              </CRDButton>
              <div>
                {currentStep !== 'intent' && (
                  <CRDButton
                    variant="outline"
                    onClick={handleBack}
                    className="mr-4"
                  >
                    Back
                  </CRDButton>
                )}
                {currentStep !== 'complete' ? (
                  <CRDButton
                    onClick={handleNext}
                    className="min-w-[120px]"
                  >
                    Next
                  </CRDButton>
                ) : (
                  <CRDButton
                    onClick={handleComplete}
                    className="min-w-[120px]"
                  >
                    Complete
                  </CRDButton>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
