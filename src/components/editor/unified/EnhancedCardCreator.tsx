
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Palette, 
  Eye, 
  Share2, 
  Save, 
  Sparkles,
  Camera,
  Layers,
  Wand2,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useCardEditor } from '@/hooks/useCardEditor';
import { PhotoUploadSection } from './sections/PhotoUploadSection';
import { TemplateSelectionSection } from './sections/TemplateSelectionSection';
import { DesignStudioSection } from './sections/DesignStudioSection';
import { PreviewStudioSection } from './sections/PreviewStudioSection';
import { PublishingSection } from './sections/PublishingSection';

export const EnhancedCardCreator = () => {
  const navigate = useNavigate();
  const cardEditor = useCardEditor();
  const [currentStep, setCurrentStep] = useState<'upload' | 'template' | 'design' | 'preview' | 'publish'>('upload');
  const [progress, setProgress] = useState(20);

  const steps = [
    { id: 'upload', title: 'Upload', icon: Upload, description: 'Upload your image' },
    { id: 'template', title: 'Frame', icon: Layers, description: 'Choose a frame template' },
    { id: 'design', title: 'Design', icon: Palette, description: 'Customize design & effects' },
    { id: 'preview', title: 'Preview', icon: Eye, description: '3D preview & refinement' },
    { id: 'publish', title: 'Publish', icon: Share2, description: 'Publish & share your card' }
  ];

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep);
  const currentStepData = steps[getCurrentStepIndex()];

  const handleStepChange = (stepId: string) => {
    setCurrentStep(stepId as typeof currentStep);
    const stepIndex = steps.findIndex(step => step.id === stepId);
    setProgress((stepIndex + 1) / steps.length * 100);
  };

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      handleStepChange(steps[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      handleStepChange(steps[currentIndex - 1].id);
    }
  };

  const handleSaveAndExit = async () => {
    try {
      await cardEditor.saveCard();
      toast.success('Card saved successfully!');
      navigate('/gallery');
    } catch (error) {
      toast.error('Failed to save card');
    }
  };

  const handlePublish = async () => {
    try {
      await cardEditor.publishCard();
      toast.success('Card published successfully!');
      navigate('/gallery');
    } catch (error) {
      toast.error('Failed to publish card');
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/gallery')} className="text-crd-lightGray hover:text-crd-white">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-crd-white">Create Card</h1>
              <Badge variant="secondary" className="bg-crd-green/20 text-crd-green">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Enhanced
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <CRDButton variant="outline" onClick={handleSaveAndExit}>
                <Save className="w-4 h-4 mr-2" />
                Save & Exit
              </CRDButton>
              <div className="text-crd-lightGray text-sm">
                {cardEditor.isDirty ? 'Unsaved changes' : 'All changes saved'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-crd-lightGray mb-2">
              <span>Step {getCurrentStepIndex() + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Step Indicators */}
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = index < getCurrentStepIndex();
              const Icon = step.icon;
              
              return (
                <button
                  key={step.id}
                  onClick={() => handleStepChange(step.id)}
                  className={`flex flex-col items-center space-y-2 transition-colors ${
                    isActive ? 'text-crd-green' : isCompleted ? 'text-crd-lightGray' : 'text-crd-mediumGray'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-crd-green text-black' : 
                    isCompleted ? 'bg-crd-lightGray text-crd-darkest' : 
                    'bg-crd-mediumGray text-crd-lightGray'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-medium">{step.title}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-crd-white mb-2">{currentStepData.title}</h2>
          <p className="text-crd-lightGray">{currentStepData.description}</p>
        </div>

        <Card className="bg-crd-darkGray border-crd-mediumGray/30">
          <CardContent className="p-8">
            <Tabs value={currentStep} onValueChange={handleStepChange}>
              <TabsContent value="upload" className="mt-0">
                <PhotoUploadSection 
                  cardEditor={cardEditor}
                  onNext={handleNext}
                />
              </TabsContent>
              
              <TabsContent value="template" className="mt-0">
                <TemplateSelectionSection 
                  cardEditor={cardEditor}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              </TabsContent>
              
              <TabsContent value="design" className="mt-0">
                <DesignStudioSection 
                  cardEditor={cardEditor}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              </TabsContent>
              
              <TabsContent value="preview" className="mt-0">
                <PreviewStudioSection 
                  cardEditor={cardEditor}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              </TabsContent>
              
              <TabsContent value="publish" className="mt-0">
                <PublishingSection 
                  cardEditor={cardEditor}
                  onPublish={handlePublish}
                  onPrevious={handlePrevious}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
