
import React, { useState } from 'react';
import { useCardEditor } from '@/hooks/useCardEditor';
import { toast } from 'sonner';
import type { CreationMode, CreationStep, ModeConfig } from './types';

// Import refactored components
import { CreatorContainer } from './components/CreatorContainer';
import { CreatorHeader } from './components/CreatorHeader';
import { CreatorProgress } from './components/CreatorProgress';
import { CreatorNavigation } from './components/CreatorNavigation';
import { StepRenderer } from './components/StepRenderer';

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
  const showNavigation = currentStep !== 'intent' && currentStep !== 'complete';

  const handleModeSelect = (mode: CreationMode) => {
    console.log('Mode selected:', mode);
    setSelectedMode(mode);
    setCurrentStep('upload');
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

  const handleStartOver = () => {
    setCurrentStep('intent');
    setSelectedMode('quick');
    cardEditor.updateCardField('title', 'My New Card');
    cardEditor.updateCardField('description', '');
    cardEditor.updateCardField('image_url', undefined);
  };

  return (
    <CreatorContainer currentStep={currentStep}>
      {/* Header */}
      <CreatorHeader title={currentConfig.title} />

      {/* Progress */}
      {showNavigation && (
        <CreatorProgress 
          steps={currentConfig.steps} 
          currentStepIndex={currentStepIndex} 
        />
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StepRenderer
          currentStep={currentStep}
          selectedMode={selectedMode}
          cardData={cardEditor.cardData}
          onModeSelect={handleModeSelect}
          onFieldUpdate={cardEditor.updateCardField}
          onStartOver={handleStartOver}
        />
      </div>

      {/* Navigation */}
      {showNavigation && (
        <CreatorNavigation
          currentStep={currentStep}
          canGoBack={canGoBack}
          canAdvance={canAdvance}
          validateStep={validateStep}
          onBack={handleBack}
          onNext={handleNext}
          onComplete={handleComplete}
          isCreating={isCreating}
        />
      )}
    </CreatorContainer>
  );
};
