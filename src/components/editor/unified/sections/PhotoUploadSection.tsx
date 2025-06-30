import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';
import { useFreeAIAnalysis } from '@/hooks/useFreeAIAnalysis';
import { useTemplates } from '@/hooks/useTemplates';
import { MediaPathAnalyzer } from '@/lib/crdmkr/mediaPathAnalyzer';
import { ProfessionalPSDManager } from './components/ProfessionalPSDManager';
import { CRDFrameGenerator } from '@/lib/crdmkr/crdFrameGenerator';

import { AIToolsPanel } from './components/AIToolsPanel';
import { UploadStep } from './components/UploadStep';
import { PathSelectionStep } from './components/PathSelectionStep';
import { TemplateSelectionStep } from './components/TemplateSelectionStep';
import { StepHeader } from './components/StepHeader';
import { BatchProcessingStep } from './components/BatchProcessingStep';
import { WorkflowStepIndicator } from './components/WorkflowStepIndicator';
import { WorkflowNavigation } from './components/WorkflowNavigation';
import { useWorkflowManager } from './hooks/useWorkflowManager';

interface PhotoUploadSectionProps {
  cardEditor: ReturnType<typeof import('@/hooks/useCardEditor').useCardEditor>;
  onNext: () => void;
}

export const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  cardEditor,
  onNext
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { analyzeImage, isAnalyzing } = useFreeAIAnalysis();
  const { templates, isLoading: templatesLoading } = useTemplates();
  const { state, updateState, validateCurrentStep, searchParams } = useWorkflowManager(cardEditor);

  const processFile = useCallback(async (file: File) => {
    console.log('📁 Processing file:', file.name);
    setIsProcessing(true);
    setUploadProgress(0);
    updateState({ originalFile: file });

    try {
      const workflow = searchParams.get('workflow');
      const isPSDWorkflow = workflow === 'psd-professional' || file.name.toLowerCase().endsWith('.psd');
      
      if (isPSDWorkflow) {
        console.log('🎨 Detected PSD professional workflow');
        updateState({ 
          showPSDManager: true, 
          currentStep: 'psd-manager' 
        });
        setUploadProgress(100);
        
        const imageUrl = URL.createObjectURL(file);
        cardEditor.updateCardField('image_url', imageUrl);
        
        toast.success('PSD file ready for professional processing!');
        return;
      }

      // Handle batch processing workflow
      if (workflow === 'batch-processing') {
        console.log('⚡ Processing for batch workflow');
        const imageUrl = URL.createObjectURL(file);
        cardEditor.updateCardField('image_url', imageUrl);
        setUploadProgress(100);
        updateState({ currentStep: 'batch-processing' });
        
        toast.success('Image ready for batch processing!');
        return;
      }

      const detection = await MediaPathAnalyzer.analyzeFile(file);
      updateState({ 
        mediaDetection: detection,
        selectedMediaPath: detection.recommendedPath 
      });
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 50) {
            clearInterval(progressInterval);
            return 50;
          }
          return prev + 10;
        });
      }, 200);

      const imageUrl = URL.createObjectURL(file);
      cardEditor.updateCardField('image_url', imageUrl);

      console.log('🤖 Starting AI analysis...');
      const result = await analyzeImage(imageUrl);
      
      if (result) {
        updateState({
          imageAnalysis: {
            dominantColors: result.colorPalette,
            suggestedRarity: result.suggestedRarity,
            contentType: result.contentType,
            tags: result.tags,
            quality: result.quality,
            detectedText: result.detectedText,
            suggestedTemplate: result.suggestedTemplate,
            confidence: result.confidence
          },
          currentStep: 'path-selection'
        });
        
        setUploadProgress(100);
        clearInterval(progressInterval);
        
        console.log('✅ Analysis complete:', { detection, result });
        toast.success(`File analyzed! Detected: ${detection.format}`);
      } else {
        throw new Error('Analysis failed');
      }

    } catch (error) {
      console.error('Upload/Analysis error:', error);
      toast.error('Failed to analyze file');
      updateState({ currentStep: 'upload' });
    } finally {
      setIsProcessing(false);
    }
  }, [cardEditor, analyzeImage, searchParams, updateState]);

  const handlePathSelect = (pathId: string) => {
    updateState({ selectedMediaPath: pathId });
    console.log('🎯 Selected media path:', pathId);
    
    cardEditor.updateDesignMetadata('workflowPath', pathId);
    
    if (pathId === 'psd-professional') {
      updateState({ showAITools: true });
    } else if (['standard-card', 'interactive-card', 'quick-frame'].includes(pathId)) {
      updateState({ currentStep: 'template-selection' });
    } else {
      toast.success(`${pathId} workflow selected!`);
      updateState({ showAITools: true });
    }
  };

  const handleTemplateGenerated = (template: any) => {
    console.log('🎯 Professional template generated:', template);
    updateState({ generatedTemplate: template });
    
    cardEditor.updateCardField('template_id', template.id);
    if (template.template_data) {
      cardEditor.updateDesignMetadata('frame', template.template_data);
    }
    
    updateState({ 
      showPSDManager: false,
      showAITools: true 
    });
    
    toast.success('Professional CRD Frame created!', {
      description: 'Template is now ready for your card creation workflow'
    });
  };

  const handlePSDManagerCancel = () => {
    updateState({
      showPSDManager: false,
      currentStep: 'upload',
      originalFile: null
    });
    setUploadProgress(0);
    setIsProcessing(false);
    cardEditor.updateCardField('image_url', '');
  };

  const handleTemplateSelect = (templateId: string) => {
    updateState({ selectedTemplate: templateId });
    cardEditor.updateCardField('template_id', templateId);
    
    const template = templates.find(t => t.id === templateId);
    if (template && template.template_data) {
      cardEditor.updateDesignMetadata('frame', template.template_data);
    }
    
    console.log('✅ Template selected:', templateId, 'Validation:', validateCurrentStep());
    updateState({ showAITools: true });
    toast.success('Template selected!');
  };

  // Show PSD Manager if activated
  if (state.showPSDManager && state.originalFile) {
    return (
      <ProfessionalPSDManager
        psdFile={state.originalFile}
        userImage={cardEditor.cardData.image_url}
        onFrameGenerated={handleTemplateGenerated}
        onCancel={handlePSDManagerCancel}
      />
    );
  }

  const handleBack = () => {
    console.log('⬅️ Going back from step:', state.currentStep);
    if (state.currentStep === 'template-selection') updateState({ currentStep: 'path-selection' });
    else if (state.currentStep === 'path-selection') updateState({ currentStep: 'upload' });
    else if (state.currentStep === 'batch-processing') updateState({ currentStep: 'upload' });
  };

  const getStepText = () => {
    const workflow = searchParams.get('workflow');
    
    switch (state.currentStep) {
      case 'upload':
        if (!cardEditor.cardData.image_url) {
          if (workflow === 'batch-processing') return 'Upload multiple images for batch processing';
          if (workflow === 'psd-professional') return 'Upload your PSD file for professional processing';
          return 'Upload your media file';
        }
        if (isProcessing || isAnalyzing) return 'Processing with AI analysis...';
        return 'Ready to continue workflow';
      
      case 'batch-processing':
        if (!cardEditor.cardData.image_url) return 'Upload images for batch processing';
        return 'Batch processing ready - continue to effects';
      
      case 'path-selection':
        if (!state.selectedMediaPath) return 'Choose your workflow path';
        return 'Workflow selected - ready to continue';
      
      case 'template-selection':
        if (!state.selectedTemplate) return 'Select a template';
        return 'Template selected - ready to continue';
      
      case 'psd-manager':
        if (!state.generatedTemplate && !state.showAITools) return 'Processing PSD file';
        return 'PSD processing complete';
      
      default:
        return 'Complete current step';
    }
  };

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'upload':
        return (
          <UploadStep
            isProcessing={isProcessing}
            isAnalyzing={isAnalyzing}
            uploadProgress={uploadProgress}
            imageUrl={cardEditor.cardData.image_url}
            onFileSelect={processFile}
          />
        );

      case 'batch-processing':
        return <BatchProcessingStep imageUrl={cardEditor.cardData.image_url} />;

      case 'path-selection':
        return (
          <PathSelectionStep
            mediaDetection={state.mediaDetection}
            selectedMediaPath={state.selectedMediaPath}
            onPathSelect={handlePathSelect}
            originalFile={state.originalFile}
            userImage={cardEditor.cardData.image_url}
            onTemplateGenerated={handleTemplateGenerated}
          />
        );

      case 'template-selection':
        return (
          <TemplateSelectionStep
            templates={templates}
            templatesLoading={templatesLoading}
            selectedTemplate={state.selectedTemplate}
            imageAnalysis={state.imageAnalysis}
            onTemplateSelect={handleTemplateSelect}
          />
        );

      case 'psd-manager':
        return (
          <div className="text-center text-crd-lightGray">
            Processing PSD file...
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = validateCurrentStep();
  const workflow = searchParams.get('workflow');

  return (
    <div className="space-y-8 relative z-10">
      {/* Enhanced Header with Workflow Context */}
      <div className="space-y-4">
        <StepHeader 
          currentStep={state.currentStep}
          mediaDetection={state.mediaDetection}
        />
        <WorkflowStepIndicator currentStep={state.currentStep} workflow={workflow} />
      </div>

      {/* Enhanced Navigation Section */}
      <WorkflowNavigation
        currentStep={state.currentStep}
        canProceed={canProceed}
        stepText={getStepText()}
        workflow={workflow}
        onBack={handleBack}
        onNext={onNext}
      />

      {/* Validation Feedback */}
      {!canProceed && (
        <div className="bg-crd-mediumGray/10 border border-crd-mediumGray/20 rounded-lg p-4">
          <p className="text-crd-lightGray text-sm">
            <span className="text-crd-yellow">⚠️</span> {getStepText()}
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-[500px]">
        {renderCurrentStep()}
        
        {/* Professional Template Status */}
        {state.generatedTemplate && (
          <div className="mt-8 p-6 bg-gradient-to-r from-crd-green/10 via-crd-green/5 to-crd-blue/10 border border-crd-green/30 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="bg-crd-green/20 p-3 rounded-xl">
                <ArrowRight className="w-6 h-6 text-crd-green" />
              </div>
              <div>
                <h4 className="text-crd-green font-bold text-lg mb-2">Professional CRD Frame Generated</h4>
                <p className="text-crd-lightGray">
                  Your PSD has been converted to a high-quality, reusable CRD Frame: "{state.generatedTemplate.name}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Tools Panel */}
      {state.showAITools && cardEditor.cardData.image_url && state.imageAnalysis && (
        <AIToolsPanel
          analysisData={state.imageAnalysis}
          onEnhance={() => {}}
          onCreateFromPSD={() => {}}
          onFrameGenerated={handleTemplateGenerated}
          userImage={cardEditor.cardData.image_url}
        />
      )}
    </div>
  );
};
