import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { CRDButton } from '@/components/ui/design-system/Button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
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

interface PhotoUploadSectionProps {
  cardEditor: ReturnType<typeof import('@/hooks/useCardEditor').useCardEditor>;
  onNext: () => void;
}

// Define the workflow step type consistently across the entire component
type WorkflowStep = 'upload' | 'path-selection' | 'template-selection' | 'psd-manager';

export const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  cardEditor,
  onNext
}) => {
  const [searchParams] = useSearchParams();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAITools, setShowAITools] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [mediaDetection, setMediaDetection] = useState<any>(null);
  const [selectedMediaPath, setSelectedMediaPath] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [generatedTemplate, setGeneratedTemplate] = useState<any>(null);
  const [showPSDManager, setShowPSDManager] = useState(false);
  
  const { analyzeImage, isAnalyzing } = useFreeAIAnalysis();
  const { templates, isLoading: templatesLoading } = useTemplates();

  // Enhanced step validation logic
  const validateCurrentStep = () => {
    console.log('🔍 Validating step:', currentStep, {
      hasImage: !!cardEditor.cardData.image_url,
      selectedMediaPath,
      selectedTemplate,
      generatedTemplate,
      isProcessing,
      isAnalyzing
    });

    switch (currentStep) {
      case 'upload':
        return !!cardEditor.cardData.image_url && !isProcessing && !isAnalyzing;
      
      case 'path-selection':
        return !!selectedMediaPath && !!cardEditor.cardData.image_url;
      
      case 'template-selection':
        return !!selectedTemplate && !!cardEditor.cardData.image_url;
      
      case 'psd-manager':
        return !!generatedTemplate || showAITools;
      
      default:
        return false;
    }
  };

  // Get dynamic step information
  const getStepInfo = () => {
    const stepMap = {
      'upload': { number: 1, total: 4 },
      'path-selection': { number: 2, total: 4 },
      'template-selection': { number: 3, total: 4 },
      'psd-manager': { number: 3, total: 4 } // PSD manager is alternative to template selection
    };
    
    return stepMap[currentStep] || { number: 1, total: 4 };
  };

  // Enhanced continue button logic
  const canProceed = () => {
    const stepValid = validateCurrentStep();
    
    // Additional checks for specific workflow paths
    if (currentStep === 'path-selection') {
      // If path requires template selection, move to template step
      if (['standard-card', 'interactive-card', 'quick-frame'].includes(selectedMediaPath)) {
        return stepValid;
      }
      // For other paths, can proceed directly
      return stepValid;
    }
    
    if (currentStep === 'template-selection') {
      return stepValid;
    }
    
    return stepValid;
  };

  // Get step-specific text and requirements
  const getStepText = () => {
    switch (currentStep) {
      case 'upload':
        if (!cardEditor.cardData.image_url) return 'Upload your media file';
        if (isProcessing || isAnalyzing) return 'Processing...';
        return 'Ready to choose workflow';
      
      case 'path-selection':
        if (!selectedMediaPath) return 'Choose your workflow path';
        return 'Workflow selected - ready to continue';
      
      case 'template-selection':
        if (!selectedTemplate) return 'Select a template';
        return 'Template selected - ready to continue';
      
      case 'psd-manager':
        if (!generatedTemplate && !showAITools) return 'Processing PSD file';
        return 'PSD processing complete';
      
      default:
        return 'Complete current step';
    }
  };

  // Simple step indicator component
  const SimpleStepIndicator = ({ currentStep }: { currentStep: WorkflowStep }) => {
    const steps: Array<{ id: WorkflowStep; label: string; description: string }> = [
      { id: 'upload', label: 'Upload', description: 'Choose your media' },
      { id: 'path-selection', label: 'Workflow', description: 'Select creation path' },
      { id: 'template-selection', label: 'Template', description: 'Pick design' },
      { id: 'psd-manager', label: 'PSD Studio', description: 'Professional editing' }
    ];

    const currentStepIndex = steps.findIndex(step => step.id === currentStep);

    return (
      <div className="flex items-center justify-center gap-2 py-4">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isVisible = index <= currentStepIndex || (currentStep === 'psd-manager' && step.id === 'psd-manager');

          if (!isVisible) return null;

          return (
            <div key={step.id} className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-gradient-to-r from-crd-green/20 to-crd-blue/20 border border-crd-green/40 shadow-lg' 
                : isCompleted 
                ? 'bg-crd-green/10 border border-crd-green/20' 
                : 'bg-crd-mediumGray/10 border border-crd-mediumGray/20'
            }`}>
              <div className={`w-5 h-5 ${isActive ? 'text-crd-green' : isCompleted ? 'text-crd-green' : 'text-crd-mediumGray'}`}>
                {isCompleted ? '✓' : index + 1}
              </div>
              <div>
                <div className={`font-semibold ${
                  isActive ? 'text-crd-green' : isCompleted ? 'text-crd-green' : 'text-crd-mediumGray'
                }`}>
                  {step.label}
                </div>
                <div className="text-xs text-crd-lightGray">
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Handle URL parameters for auto-triggering PSD workflow
  useEffect(() => {
    const source = searchParams.get('source');
    const workflow = searchParams.get('workflow');
    
    if (source === 'crdmkr' && workflow === 'psd-professional') {
      console.log('🎯 Auto-activating PSD Professional workflow');
      setSelectedMediaPath('psd-professional');
      setCurrentStep('upload');
      
      cardEditor.updateDesignMetadata('workflowSource', 'crdmkr');
      cardEditor.updateDesignMetadata('workflowType', 'psd-professional');
    }
  }, [searchParams, cardEditor]);

  const processFile = useCallback(async (file: File) => {
    console.log('📁 Processing file:', file.name);
    setIsProcessing(true);
    setUploadProgress(0);
    setOriginalFile(file);

    try {
      const workflow = searchParams.get('workflow');
      const isPSDWorkflow = workflow === 'psd-professional' || file.name.toLowerCase().endsWith('.psd');
      
      if (isPSDWorkflow) {
        console.log('🎨 Detected PSD professional workflow');
        setShowPSDManager(true);
        setCurrentStep('psd-manager');
        setUploadProgress(100);
        
        const imageUrl = URL.createObjectURL(file);
        cardEditor.updateCardField('image_url', imageUrl);
        
        toast.success('PSD file ready for professional processing!');
        return;
      }

      const detection = await MediaPathAnalyzer.analyzeFile(file);
      setMediaDetection(detection);
      setSelectedMediaPath(detection.recommendedPath);
      
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
        setImageAnalysis({
          dominantColors: result.colorPalette,
          suggestedRarity: result.suggestedRarity,
          contentType: result.contentType,
          tags: result.tags,
          quality: result.quality,
          detectedText: result.detectedText,
          suggestedTemplate: result.suggestedTemplate,
          confidence: result.confidence
        });
        
        setUploadProgress(100);
        clearInterval(progressInterval);
        setCurrentStep('path-selection');
        
        console.log('✅ Analysis complete:', { detection, result });
        toast.success(`File analyzed! Detected: ${detection.format}`);
      } else {
        throw new Error('Analysis failed');
      }

    } catch (error) {
      console.error('Upload/Analysis error:', error);
      toast.error('Failed to analyze file');
      setCurrentStep('upload');
    } finally {
      setIsProcessing(false);
    }
  }, [cardEditor, analyzeImage, searchParams]);

  const handlePathSelect = (pathId: string) => {
    setSelectedMediaPath(pathId);
    console.log('🎯 Selected media path:', pathId);
    
    cardEditor.updateDesignMetadata('workflowPath', pathId);
    
    if (pathId === 'psd-professional') {
      setShowAITools(true);
    } else if (['standard-card', 'interactive-card', 'quick-frame'].includes(pathId)) {
      setCurrentStep('template-selection');
    } else {
      toast.success(`${pathId} workflow selected!`);
      setShowAITools(true);
    }
  };

  const handleTemplateGenerated = (template: any) => {
    console.log('🎯 Professional template generated:', template);
    setGeneratedTemplate(template);
    
    cardEditor.updateCardField('template_id', template.id);
    if (template.template_data) {
      cardEditor.updateDesignMetadata('frame', template.template_data);
    }
    
    setShowPSDManager(false);
    setShowAITools(true);
    
    toast.success('Professional CRD Frame created!', {
      description: 'Template is now ready for your card creation workflow'
    });
  };

  const handlePSDManagerCancel = () => {
    setShowPSDManager(false);
    setCurrentStep('upload');
    setOriginalFile(null);
    setUploadProgress(0);
    setIsProcessing(false);
    cardEditor.updateCardField('image_url', '');
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    cardEditor.updateCardField('template_id', templateId);
    
    const template = templates.find(t => t.id === templateId);
    if (template && template.template_data) {
      cardEditor.updateDesignMetadata('frame', template.template_data);
    }
    
    console.log('✅ Template selected:', templateId, 'Validation:', validateCurrentStep());
    setShowAITools(true);
    toast.success('Template selected!');
  };

  // Show PSD Manager if activated
  if (showPSDManager && originalFile) {
    return (
      <ProfessionalPSDManager
        psdFile={originalFile}
        userImage={cardEditor.cardData.image_url}
        onFrameGenerated={handleTemplateGenerated}
        onCancel={handlePSDManagerCancel}
      />
    );
  }

  const handleBack = () => {
    console.log('⬅️ Going back from step:', currentStep);
    if (currentStep === 'template-selection') setCurrentStep('path-selection');
    else if (currentStep === 'path-selection') setCurrentStep('upload');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
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

      case 'path-selection':
        return (
          <PathSelectionStep
            mediaDetection={mediaDetection}
            selectedMediaPath={selectedMediaPath}
            onPathSelect={handlePathSelect}
            originalFile={originalFile}
            userImage={cardEditor.cardData.image_url}
            onTemplateGenerated={handleTemplateGenerated}
          />
        );

      case 'template-selection':
        return (
          <TemplateSelectionStep
            templates={templates}
            templatesLoading={templatesLoading}
            selectedTemplate={selectedTemplate}
            imageAnalysis={imageAnalysis}
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

  // Enhanced step info for dynamic display
  const stepInfo = getStepInfo();
  const proceedEnabled = canProceed();

  return (
    <div className="space-y-8 relative z-10">
      {/* Enhanced Header */}
      <div className="space-y-4">
        <StepHeader 
          currentStep={currentStep}
          mediaDetection={mediaDetection}
        />
        <SimpleStepIndicator currentStep={currentStep} />
      </div>

      {/* Enhanced Navigation Section */}
      <div className="flex justify-between items-center py-6 border-y border-crd-green/20 bg-gradient-to-r from-transparent via-crd-green/5 to-transparent">
        <div className="text-lg text-crd-lightGray">
          <span className="text-crd-green font-semibold">Step {stepInfo.number} of {stepInfo.total}</span> - {getStepText()}
        </div>
        
        <div className="flex gap-4">
          {currentStep !== 'upload' && currentStep !== 'psd-manager' && (
            <CRDButton 
              onClick={handleBack}
              variant="outline"
              className="min-w-[100px] border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white hover:border-crd-green/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </CRDButton>
          )}
          
          <CRDButton 
            onClick={onNext} 
            disabled={!proceedEnabled}
            className={`min-w-[140px] ${
              proceedEnabled 
                ? 'bg-gradient-to-r from-crd-green to-crd-blue hover:from-crd-green/90 hover:to-crd-blue/90 text-black font-bold shadow-xl' 
                : 'bg-crd-mediumGray/20 text-crd-lightGray cursor-not-allowed'
            }`}
          >
            Continue to Effects
            <ArrowRight className="w-5 h-5 ml-2" />
          </CRDButton>
        </div>
      </div>

      {/* Validation Feedback for Users */}
      {!proceedEnabled && (
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
        {generatedTemplate && (
          <div className="mt-8 p-6 bg-gradient-to-r from-crd-green/10 via-crd-green/5 to-crd-blue/10 border border-crd-green/30 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="bg-crd-green/20 p-3 rounded-xl">
                <ArrowRight className="w-6 h-6 text-crd-green" />
              </div>
              <div>
                <h4 className="text-crd-green font-bold text-lg mb-2">Professional CRD Frame Generated</h4>
                <p className="text-crd-lightGray">
                  Your PSD has been converted to a high-quality, reusable CRD Frame: "{generatedTemplate.name}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Tools Panel */}
      {showAITools && cardEditor.cardData.image_url && imageAnalysis && (
        <AIToolsPanel
          analysisData={imageAnalysis}
          onEnhance={() => {}}
          onCreateFromPSD={() => {}}
          onFrameGenerated={handleTemplateGenerated}
          userImage={cardEditor.cardData.image_url}
        />
      )}
    </div>
  );
};
