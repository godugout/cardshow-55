
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { useCardEditor } from '@/hooks/useCardEditor';
import { toast } from 'sonner';

// Simple step components
import { IntentStep } from './components/steps/IntentStep';
import { PhotoStep } from './components/steps/PhotoStep';
import { DetailsStep } from './components/steps/DetailsStep';
import { DesignStep } from './components/steps/DesignStep';
import { PublishStep } from './components/steps/PublishStep';
import { CompleteStep } from './components/steps/CompleteStep';

type CreationMode = 'quick' | 'guided' | 'advanced';
type CreationStep = 'intent' | 'upload' | 'details' | 'design' | 'publish' | 'complete';

interface ModeConfig {
  steps: CreationStep[];
  title: string;
}

const MODE_CONFIGS: Record<CreationMode, ModeConfig> = {
  quick: {
    steps: ['intent', 'upload', 'details', 'publish'],
    title: 'Quick Create'
  },
  guided: {
    steps: ['intent', 'upload', 'details', 'design', 'publish'],
    title: 'Guided Create'
  },
  advanced: {
    steps: ['intent', 'upload', 'design', 'details', 'publish'],
    title: 'Advanced Create'
  }
};

export const SimpleCardCreator = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CreationStep>('intent');
  const [selectedMode, setSelectedMode] = useState<CreationMode>('quick');
  const [isCreating, setIsCreating] = useState(false);
  
  const cardEditor = useCardEditor({
    autoSave: false,
    autoSaveInterval: 0
  });

  const currentConfig = MODE_CONFIGS[selectedMode];
  const currentStepIndex = currentConfig.steps.indexOf(currentStep);
  const canGoBack = currentStepIndex > 0;
  const canAdvance = currentStepIndex < currentConfig.steps.length - 1;

  const handleModeSelect = (mode: CreationMode) => {
    console.log('Mode selected:', mode);
    setSelectedMode(mode);
    setCurrentStep('upload'); // Move to first actual step
  };

  const handleNext = () => {
    if (canAdvance) {
      const nextStep = currentConfig.steps[currentStepIndex + 1];
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    if (canGoBack) {
      const prevStep = currentConfig.steps[currentStepIndex - 1];
      setCurrentStep(prevStep);
    }
  };

  const handleComplete = async () => {
    setIsCreating(true);
    try {
      const success = await cardEditor.saveCard();
      if (success) {
        setCurrentStep('complete');
        toast.success('Card created successfully!');
      } else {
        throw new Error('Failed to save card');
      }
    } catch (error) {
      console.error('Error creating card:', error);
      toast.error('Failed to create card');
    } finally {
      setIsCreating(false);
    }
  };

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 'upload':
        return !!cardEditor.cardData.image_url;
      case 'details':
        return !!cardEditor.cardData.title && cardEditor.cardData.title.trim() !== '' && cardEditor.cardData.title !== 'My New Card';
      default:
        return true;
    }
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
          />
        );
      case 'details':
        return (
          <DetailsStep
            mode={selectedMode}
            cardData={cardEditor.cardData}
            onFieldUpdate={cardEditor.updateCardField}
          />
        );
      case 'design':
        return (
          <DesignStep
            mode={selectedMode}
            cardData={cardEditor.cardData}
            onFieldUpdate={cardEditor.updateCardField}
          />
        );
      case 'publish':
        return (
          <PublishStep
            mode={selectedMode}
            cardData={cardEditor.cardData}
            onFieldUpdate={cardEditor.updateCardField}
          />
        );
      case 'complete':
        return (
          <CompleteStep
            mode={selectedMode}
            cardData={cardEditor.cardData}
            onGoToGallery={() => navigate('/gallery')}
            onStartOver={() => {
              setCurrentStep('intent');
              setSelectedMode('quick');
              cardEditor.updateCardField('title', 'My New Card');
              cardEditor.updateCardField('description', '');
              cardEditor.updateCardField('image_url', undefined);
            }}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  const showNavigation = currentStep !== 'intent' && currentStep !== 'complete';

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-crd-white">
            {currentConfig.title}
          </h1>
          <CRDButton
            variant="outline"
            onClick={() => navigate('/gallery')}
            className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
          >
            Cancel
          </CRDButton>
        </div>
      </div>

      {/* Progress */}
      {showNavigation && (
        <div className="bg-crd-darker border-b border-crd-mediumGray/20 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-4">
              {currentConfig.steps.slice(1).map((step, index) => {
                const actualIndex = index + 1;
                const isActive = actualIndex === currentStepIndex;
                const isComplete = actualIndex < currentStepIndex;
                
                return (
                  <div
                    key={step}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isComplete
                        ? 'bg-crd-green text-black'
                        : isActive
                        ? 'bg-crd-blue text-white'
                        : 'bg-crd-mediumGray/20 text-crd-lightGray'
                    }`}
                  >
                    {actualIndex}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      {showNavigation && (
        <div className="fixed bottom-0 left-0 right-0 bg-crd-darker border-t border-crd-mediumGray/20 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <CRDButton
              variant="outline"
              onClick={handleBack}
              disabled={!canGoBack}
              className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </CRDButton>

            {currentStep === 'publish' ? (
              <CRDButton
                variant="primary"
                onClick={handleComplete}
                disabled={!validateStep() || isCreating}
                className="bg-crd-green hover:bg-crd-green/80 text-black"
              >
                {isCreating ? 'Creating...' : 'Create Card'}
              </CRDButton>
            ) : (
              <CRDButton
                variant="primary"
                onClick={handleNext}
                disabled={!validateStep()}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </CRDButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
