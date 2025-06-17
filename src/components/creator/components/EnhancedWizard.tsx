
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { EnhancedPhotoUploadStep } from './wizard/EnhancedPhotoUploadStep';
import { EnhancedTemplateStep } from './wizard/EnhancedTemplateStep';
import { EnhancedDetailsStep } from './wizard/EnhancedDetailsStep';
import { EnhancedPublishStep } from './wizard/EnhancedPublishStep';
import { useWizardState } from '@/components/editor/wizard/useWizardState';
import type { CardData } from '@/hooks/useCardEditor';

type WizardMode = 'quick' | 'advanced';

interface EnhancedWizardProps {
  mode: WizardMode;
  onComplete: (cardData: CardData) => void;
  onBack: () => void;
}

export const EnhancedWizard = ({ mode, onComplete, onBack }: EnhancedWizardProps) => {
  const { wizardState, cardData, handlers, isSaving, templates } = useWizardState(onComplete);

  const steps = [
    { id: 1, title: 'Upload Photo', component: 'photo' },
    { id: 2, title: 'Choose Template', component: 'template' },
    { id: 3, title: 'Card Details', component: 'details' },
    { id: 4, title: 'Publish', component: 'publish' }
  ];

  const canSkipToEnd = mode === 'quick' && 
                      wizardState.aiAnalysisComplete && 
                      wizardState.selectedTemplate;

  const renderStepContent = () => {
    switch (wizardState.currentStep) {
      case 1:
        return (
          <EnhancedPhotoUploadStep
            mode={mode}
            selectedPhoto={wizardState.selectedPhoto}
            onPhotoSelect={handlers.handlePhotoSelect}
            onAnalysisComplete={handlers.handleAiAnalysis}
          />
        );
      case 2:
        return (
          <EnhancedTemplateStep
            mode={mode}
            templates={templates}
            selectedTemplate={wizardState.selectedTemplate}
            onTemplateSelect={handlers.handleTemplateSelect}
            aiAnalysisComplete={wizardState.aiAnalysisComplete}
          />
        );
      case 3:
        return (
          <EnhancedDetailsStep
            mode={mode}
            cardData={cardData}
            onFieldUpdate={handlers.updateCardField}
            onCreatorAttributionUpdate={handlers.updateCreatorAttribution}
            aiAnalysisComplete={wizardState.aiAnalysisComplete}
          />
        );
      case 4:
        return (
          <EnhancedPublishStep
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

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Progress Steps */}
      <div className="bg-crd-darkest border-b border-crd-mediumGray/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    wizardState.currentStep >= step.id 
                      ? 'bg-crd-green text-black' 
                      : 'bg-crd-mediumGray text-crd-lightGray'
                  }`}>
                    {wizardState.currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="text-white text-sm mt-2 text-center">
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 transition-colors ${
                    wizardState.currentStep > step.id ? 'bg-crd-green' : 'bg-crd-mediumGray'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {/* AI Status & Mode Indicator */}
          <div className="text-center mt-4 space-y-2">
            {wizardState.aiAnalysisComplete && (
              <div className="text-crd-green text-sm">
                <Sparkles className="w-4 h-4 inline mr-1" />
                AI analysis complete!
              </div>
            )}
            <div className="text-crd-lightGray text-xs">
              {mode === 'quick' ? '⚡ Quick Mode' : '🔧 Advanced Mode'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-crd-darkGray border-crd-mediumGray/30 mb-6">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={wizardState.currentStep === 1 ? onBack : handlers.handleBack}
            className="bg-transparent border-crd-lightGray text-crd-lightGray hover:bg-crd-lightGray hover:text-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {wizardState.currentStep === 1 ? 'Change Mode' : 'Back'}
          </Button>

          <div className="flex space-x-3">
            {canSkipToEnd && wizardState.currentStep < 3 && (
              <Button
                variant="outline"
                onClick={() => handlers.handleNext(3)} // Skip to details
                className="bg-crd-green/20 border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Skip to Details
              </Button>
            )}
            
            {wizardState.currentStep < 4 ? (
              <Button
                onClick={handlers.handleNext}
                className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
                disabled={isSaving}
              >
                Next
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
