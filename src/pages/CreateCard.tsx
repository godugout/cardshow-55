import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useCardEditor } from '@/hooks/useCardEditor';
import { PhotoUploadSection } from '@/components/editor/unified/sections/PhotoUploadSection';
import { EffectsTab } from '@/components/editor/sidebar/EffectsTab';
import { SVGTemplateRenderer } from '@/components/editor/templates/SVGTemplateRenderer';
import { CardPreviewRenderer } from '@/components/editor/unified/sections/components/CardPreviewRenderer';
import { CRDButton } from '@/components/ui/design-system/Button';
import { ArrowLeft, Sparkles, Grid, Layers, FileImage, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';

type CreationStep = 'upload' | 'effects';

const CreateCard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cardEditor = useCardEditor();
  const [currentStep, setCurrentStep] = useState<CreationStep>('upload');
  const [workflowInfo, setWorkflowInfo] = useState<{
    source: string | null;
    workflow: string | null;
    activated: boolean;
  }>({ source: null, workflow: null, activated: false });

  // Handle URL parameters for workflow activation with enhanced feedback
  useEffect(() => {
    const source = searchParams.get('source');
    const workflow = searchParams.get('workflow');
    
    if (source === 'crdmkr' && workflow) {
      console.log('🎯 Auto-activating workflow from URL parameters:', { source, workflow });
      
      setWorkflowInfo({ source, workflow, activated: true });
      
      // Set workflow metadata
      cardEditor.updateDesignMetadata('workflowSource', 'crdmkr');
      cardEditor.updateDesignMetadata('workflowType', workflow);
    }
  }, [searchParams, cardEditor]);

  console.log('CreateCard page loaded - enhanced workflow ready', workflowInfo);

  const getWorkflowConfig = (workflow: string | null) => {
    switch (workflow) {
      case 'psd-professional':
        return {
          title: 'PSD Professional Workflow',
          description: 'Advanced PSD layer extraction and template generation',
          icon: Layers,
          color: 'from-purple-500 to-blue-500',
          badge: 'PRO'
        };
      case 'batch-processing':
        return {
          title: 'Batch Processing Workflow',
          description: 'Efficient creation of multiple cards from uploaded media',
          icon: Grid,
          color: 'from-green-500 to-blue-500',
          badge: 'BATCH'
        };
      case 'smart-upload':
        return {
          title: 'Smart Upload Workflow',
          description: 'AI-powered image analysis and automatic template selection',
          icon: Sparkles,
          color: 'from-yellow-500 to-green-500',
          badge: 'AI'
        };
      case 'crd-frame-generator':
        return {
          title: 'CRD Frame Generator',
          description: 'Create custom reusable frames from your designs',
          icon: FileImage,
          color: 'from-blue-500 to-purple-500',
          badge: 'FRAME'
        };
      default:
        return null;
    }
  };

  const handleComplete = async (cardData: CardData) => {
    console.log('Card created successfully:', cardData);
    try {
      await cardEditor.saveCard();
      toast.success('Card created successfully!');
      navigate('/gallery');
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card');
    }
  };

  const handleCancel = () => {
    console.log('Card creation cancelled');
    navigate('/');
  };

  const handleNext = () => {
    console.log('Moving to effects step');
    setCurrentStep('effects');
    toast.success('Ready to customize your card!');
  };

  const handleBack = () => {
    console.log('Going back to upload step');
    setCurrentStep('upload');
  };

  const handleEffectsComplete = () => {
    console.log('Effects completed, saving card');
    handleComplete(cardEditor.cardData);
  };

  const handleTemplateChange = (newTemplate: any) => {
    cardEditor.updateCardField('template_id', newTemplate.id);
    if (newTemplate.template_data) {
      cardEditor.updateDesignMetadata('frame', newTemplate.template_data);
    }
    toast.success(`Switched to ${newTemplate.name}!`);
  };

  const workflowConfig = getWorkflowConfig(workflowInfo.workflow);

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-darker to-crd-darkGray">
      <ErrorBoundary>
        {/* Enhanced Header with Workflow Badge */}
        <div className="bg-gradient-to-r from-crd-darker via-crd-darkGray to-crd-darker border-b border-crd-green/20 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-crd-green to-crd-blue bg-clip-text text-transparent">
                Professional Card Creator
              </h1>
              <div className="hidden md:block h-8 w-px bg-crd-mediumGray/30"></div>
              
              {/* Step Indicator */}
              <div className="hidden md:flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${
                  currentStep === 'upload' 
                    ? 'bg-crd-green/20 border border-crd-green/40' 
                    : 'bg-crd-green/10 border border-crd-green/20'
                }`}>
                  <FileImage className={`w-4 h-4 ${currentStep === 'upload' ? 'text-crd-green' : 'text-crd-green/60'}`} />
                  <span className={`text-sm font-medium ${currentStep === 'upload' ? 'text-crd-green' : 'text-crd-green/60'}`}>
                    Upload & Select
                  </span>
                  {currentStep !== 'upload' && <Check className="w-4 h-4 text-crd-green" />}
                </div>
                
                <div className="w-8 h-px bg-crd-mediumGray/30"></div>
                
                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${
                  currentStep === 'effects' 
                    ? 'bg-crd-blue/20 border border-crd-blue/40' 
                    : 'bg-crd-mediumGray/10 border border-crd-mediumGray/20'
                }`}>
                  <Sparkles className={`w-4 h-4 ${currentStep === 'effects' ? 'text-crd-blue' : 'text-crd-mediumGray'}`} />
                  <span className={`text-sm font-medium ${currentStep === 'effects' ? 'text-crd-blue' : 'text-crd-mediumGray'}`}>
                    Customize & Publish
                  </span>
                </div>
              </div>
              
              {/* Workflow Status Badge */}
              {workflowInfo.activated && workflowConfig && (
                <div className="hidden lg:flex items-center gap-3">
                  <div className={`bg-gradient-to-r ${workflowConfig.color} p-2 rounded-lg`}>
                    <workflowConfig.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{workflowConfig.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        {workflowConfig.badge}
                      </Badge>
                    </div>
                    <p className="text-crd-lightGray text-sm">{workflowConfig.description}</p>
                  </div>
                </div>
              )}
              
              {/* Default status when no workflow */}
              {!workflowInfo.activated && (
                <div className="hidden lg:flex items-center gap-2 text-crd-lightGray">
                  <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Standard Creation Mode</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Enhanced Creator Link */}
              <CRDButton
                onClick={() => navigate('/create/enhanced')}
                className="bg-gradient-to-r from-crd-green to-crd-blue text-black hover:opacity-90 transition-opacity"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Enhanced Mode
              </CRDButton>
              
              {currentStep === 'effects' && (
                <CRDButton
                  variant="outline"
                  onClick={handleBack}
                  className="border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white hover:border-crd-green/50 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </CRDButton>
              )}
              
              <CRDButton
                variant="outline"
                onClick={handleCancel}
                className="border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white hover:border-crd-green/50 transition-all duration-200"
              >
                Cancel
              </CRDButton>
            </div>
          </div>
        </div>

        {/* Workflow Activation Confirmation */}
        {workflowInfo.activated && workflowConfig && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className={`bg-gradient-to-r ${workflowConfig.color} bg-opacity-10 border border-current border-opacity-20 rounded-xl p-4`}>
              <div className="flex items-center gap-4">
                <div className={`bg-gradient-to-r ${workflowConfig.color} p-3 rounded-xl`}>
                  <workflowConfig.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    {workflowConfig.title} Activated
                  </h3>
                  <p className="text-crd-lightGray">
                    {workflowConfig.description} - Ready to begin workflow
                  </p>
                </div>
                <Badge className="ml-auto" variant="outline">
                  {workflowConfig.badge}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentStep === 'upload' ? (
            <PhotoUploadSection
              cardEditor={cardEditor}
              onNext={handleNext}
            />
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-crd-white mb-4">Customize Your Card</h2>
                <p className="text-crd-lightGray text-lg">
                  Add effects, adjust lighting, and prepare your card for publishing
                </p>
              </div>
              
              {/* Enhanced Effects Step with Larger Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Card Preview Column - Now Larger with Frame Switching */}
                <div className="flex justify-center lg:justify-end">
                  <div className="w-full max-w-lg">
                    <h3 className="text-lg font-semibold text-crd-white mb-4 text-center">
                      Live Preview
                    </h3>
                    {cardEditor.cardData.image_url && cardEditor.cardData.template_id && (
                      <CardPreviewRenderer
                        imageUrl={cardEditor.cardData.image_url}
                        template={{ 
                          id: cardEditor.cardData.template_id,
                          template_data: cardEditor.cardData.design_metadata?.frame
                        } as any}
                        onTemplateChange={handleTemplateChange}
                        enableFrameSwitching={true}
                        size="large"
                        className="w-full"
                      />
                    )}
                  </div>
                </div>
                
                {/* Effects Controls Column */}
                <div className="w-full">
                  <EffectsTab 
                    searchQuery=""
                    onEffectsComplete={handleEffectsComplete}
                    cardEditor={cardEditor}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default CreateCard;
