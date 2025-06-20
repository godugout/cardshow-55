
import React, { useState } from 'react';
import { UploadAndStyleStep } from './steps/UploadAndStyleStep';
import { TemplateSelectionStep } from './steps/TemplateSelectionStep';
import { CanvasDesignStep } from './steps/CanvasDesignStep';
import { ProfessionalWorkflow } from './steps/ProfessionalWorkflow';
import { ImageCropInterface } from './components/ImageCropInterface';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type CreationMode = 'quick' | 'template' | 'canvas' | 'professional';
type CreationStep = 'upload' | 'template' | 'design' | 'crop' | 'finalize';

interface CardCreationData {
  selectedPhoto?: string;
  selectedStyle?: string;
  selectedTemplate?: string;
  cropData?: any;
  cardData?: any;
}

export const StreamlinedCardCreator = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<CreationMode>('quick');
  const [step, setStep] = useState<CreationStep>('upload');
  const [creationData, setCreationData] = useState<CardCreationData>({});
  const [showCropInterface, setShowCropInterface] = useState(false);

  const handleModeSelect = (selectedMode: CreationMode) => {
    setMode(selectedMode);
    
    // Set appropriate starting step based on mode
    switch (selectedMode) {
      case 'quick':
        setStep('upload');
        break;
      case 'template':
        setStep('template');
        break;
      case 'canvas':
        setStep('design');
        break;
      case 'professional':
        setStep('upload');
        break;
    }
  };

  const handleStepComplete = (stepData: any) => {
    setCreationData(prev => ({ ...prev, ...stepData }));
    
    // Navigate to next appropriate step
    if (step === 'upload' && mode === 'quick') {
      // Quick mode goes straight to finalization
      setStep('finalize');
    } else if (step === 'template') {
      setStep('design');
    } else if (step === 'design') {
      setStep('finalize');
    }
  };

  const handleCropRequest = (imageData: string) => {
    setCreationData(prev => ({ ...prev, selectedPhoto: imageData }));
    setShowCropInterface(true);
  };

  const handleCropComplete = (croppedImageData: string) => {
    setCreationData(prev => ({ ...prev, selectedPhoto: croppedImageData }));
    setShowCropInterface(false);
  };

  const handleClose = () => {
    navigate('/gallery');
  };

  const handleBack = () => {
    if (step === 'upload') {
      // Go back to mode selection
      setMode('quick');
    } else {
      // Go to previous step
      const stepOrder: CreationStep[] = ['upload', 'template', 'design', 'finalize'];
      const currentIndex = stepOrder.indexOf(step);
      if (currentIndex > 0) {
        setStep(stepOrder[currentIndex - 1]);
      }
    }
  };

  // Show crop interface if active
  if (showCropInterface) {
    return (
      <ImageCropInterface
        imageUrl={creationData.selectedPhoto || ''}
        onComplete={handleCropComplete}
        onCancel={() => setShowCropInterface(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darkest border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-white">
              <h1 className="text-xl font-semibold">Create New Card</h1>
              <p className="text-sm text-crd-lightGray capitalize">
                {mode} mode • {step}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mode Selection */}
      {!mode && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Choose Creation Mode</h2>
            <p className="text-crd-lightGray">Select how you'd like to create your card</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { mode: 'quick', title: 'Quick Card', desc: 'Upload photo + style preset' },
              { mode: 'template', title: 'Template', desc: 'Choose from pre-made designs' },
              { mode: 'canvas', title: 'Custom Canvas', desc: 'Design from scratch' },
              { mode: 'professional', title: 'Professional', desc: 'Advanced tools & workflow' }
            ].map(({ mode: modeId, title, desc }) => (
              <button
                key={modeId}
                onClick={() => handleModeSelect(modeId as CreationMode)}
                className="bg-crd-darkGray border border-crd-mediumGray/30 rounded-xl p-6 hover:border-crd-green transition-colors text-left"
              >
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-crd-lightGray text-sm">{desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      {mode && (
        <div className="flex-1">
          {step === 'upload' && (
            <UploadAndStyleStep
              mode={mode}
              onComplete={handleStepComplete}
              onCropRequest={handleCropRequest}
              initialData={creationData}
            />
          )}
          
          {step === 'template' && (
            <TemplateSelectionStep
              onComplete={handleStepComplete}
              initialData={creationData}
            />
          )}
          
          {step === 'design' && mode === 'canvas' && (
            <CanvasDesignStep
              onComplete={handleStepComplete}
              initialData={creationData}
            />
          )}
          
          {mode === 'professional' && (
            <ProfessionalWorkflow
              currentStep={step}
              onStepComplete={handleStepComplete}
              onCropRequest={handleCropRequest}
              initialData={creationData}
            />
          )}
        </div>
      )}
    </div>
  );
};
