import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles, Upload, Palette, Eye, Rocket } from 'lucide-react';
import { TemplateSelectionStep } from './wizard/TemplateSelectionStep';
import { PhotoUploadStep } from './wizard/PhotoUploadStep';
import { SportsCustomizationStep } from './wizard/SportsCustomizationStep';
import { VisualEffectsStep } from './wizard/VisualEffectsStep';
import { PreviewAndPublishStep } from './wizard/PreviewAndPublishStep';
import { useCardEditor, type CardData, type DesignTemplate } from '@/hooks/useCardEditor';
import { ALL_FRAMES } from '@/data/cardTemplates';
import { toast } from 'sonner';

interface CardCreationWizardProps {
  onComplete: (cardData: CardData) => void;
  onCancel?: () => void;
}

export const CardCreationWizard = ({ onComplete, onCancel }: CardCreationWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [visualEffects, setVisualEffects] = useState({
    holographic: false,
    chrome: false,
    foil: false,
    intensity: 0.5
  });

  const cardEditor = useCardEditor({
    autoSave: false,
    initialData: {
      title: '',
      description: '',
      rarity: 'common',
      tags: [],
      design_metadata: {},
      visibility: 'private',
      creator_attribution: {
        creator_name: '',
        creator_id: '',
        collaboration_type: 'solo'
      },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      }
    }
  });

  const steps = [
    { id: 1, title: 'Template', icon: Palette, component: 'template' },
    { id: 2, title: 'Photo', icon: Upload, component: 'photo' },
    { id: 3, title: 'Details', icon: CheckCircle, component: 'details' },
    { id: 4, title: 'Effects', icon: Sparkles, component: 'effects' },
    { id: 5, title: 'Preview', icon: Eye, component: 'preview' }
  ];

  const handleNext = () => {
    // Validation logic for each step
    if (currentStep === 1 && !selectedTemplate) {
      toast.error('Please select a template to continue');
      return;
    }
    if (currentStep === 2 && !uploadedPhoto) {
      toast.error('Please upload a photo to continue');
      return;
    }
    if (currentStep === 3 && !cardEditor.cardData.title.trim()) {
      toast.error('Please enter a card title to continue');
      return;
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTemplateSelect = (template: DesignTemplate) => {
    setSelectedTemplate(template);
    cardEditor.updateCardField('template_id', template.id);
    cardEditor.updateDesignMetadata({ 
      template: template.template_data,
      selectedTemplate: template 
    });
  };

  const handlePhotoUpload = (photoUrl: string) => {
    setUploadedPhoto(photoUrl);
    cardEditor.updateCardField('image_url', photoUrl);
    cardEditor.updateCardField('thumbnail_url', photoUrl);
  };

  const handleEffectsUpdate = (effects: typeof visualEffects) => {
    setVisualEffects(effects);
    cardEditor.updateDesignMetadata({ visualEffects: effects });
  };

  const handleComplete = async () => {
    try {
      const success = await cardEditor.saveCard();
      if (success) {
        toast.success('Card created successfully!');
        onComplete(cardEditor.cardData);
      }
    } catch (error) {
      console.error('Failed to create card:', error);
      toast.error('Failed to create card. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <TemplateSelectionStep
            templates={ALL_FRAMES}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
          />
        );
      case 2:
        return (
          <PhotoUploadStep
            selectedPhoto={uploadedPhoto}
            onPhotoSelect={handlePhotoUpload}
            selectedTemplate={selectedTemplate}
          />
        );
      case 3:
        return (
          <SportsCustomizationStep
            cardEditor={cardEditor}
            selectedTemplate={selectedTemplate}
          />
        );
      case 4:
        return (
          <VisualEffectsStep
            effects={visualEffects}
            onEffectsUpdate={handleEffectsUpdate}
            selectedTemplate={selectedTemplate}
          />
        );
      case 5:
        return (
          <PreviewAndPublishStep
            cardData={cardEditor.cardData}
            selectedTemplate={selectedTemplate}
            uploadedPhoto={uploadedPhoto}
            visualEffects={visualEffects}
            onFieldUpdate={cardEditor.updateCardField}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Progress Header */}
      <div className="bg-crd-darkest border-b border-crd-mediumGray/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      isCompleted 
                        ? 'bg-crd-green text-black' 
                        : isCurrent
                        ? 'bg-crd-green/20 border-2 border-crd-green text-crd-green'
                        : 'bg-crd-mediumGray text-crd-lightGray'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className={`text-sm mt-2 text-center transition-colors ${
                      isCurrent ? 'text-white font-medium' : 'text-crd-lightGray'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 transition-colors ${
                      isCompleted ? 'bg-crd-green' : 'bg-crd-mediumGray'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-4">
            <h1 className="text-2xl font-bold text-white mb-1">Create Your Card</h1>
            <p className="text-crd-lightGray">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-crd-darkGray border-crd-mediumGray/30 mb-6">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onCancel : handleBack}
            className="bg-transparent border-crd-lightGray text-crd-lightGray hover:bg-crd-lightGray hover:text-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>

          <div className="flex space-x-3">
            {currentStep < 5 ? (
              <Button
                onClick={handleNext}
                className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
                disabled={cardEditor.isSaving}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
                disabled={cardEditor.isSaving}
              >
                {cardEditor.isSaving ? 'Creating...' : 'Create Card'}
                <Rocket className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
