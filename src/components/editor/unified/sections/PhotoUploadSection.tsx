import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { CRDButton } from '@/components/ui/design-system/Button';
import { ArrowRight, ArrowLeft, Sparkles, Layers, Grid, FileImage } from 'lucide-react';
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

type WorkflowStep = 'upload' | 'path-selection' | 'template-selection' | 'psd-manager' | 'batch-processing';

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
  const [workflowActivated, setWorkflowActivated] = useState(false);
  
  const { analyzeImage, isAnalyzing } = useFreeAIAnalysis();
  const { templates, isLoading: templatesLoading } = useTemplates();

  // Enhanced workflow activation with visual feedback
  useEffect(() => {
    const source = searchParams.get('source');
    const workflow = searchParams.get('workflow');
    
    if (source === 'crdmkr' && workflow && !workflowActivated) {
      console.log('🎯 Activating CRDMKR workflow:', workflow);
      setWorkflowActivated(true);
      
      // Set workflow metadata
      cardEditor.updateDesignMetadata('workflowSource', 'crdmkr');
      cardEditor.updateDesignMetadata('workflowType', workflow);
      
      // Handle different workflow types
      switch (workflow) {
        case 'psd-professional':
          setSelectedMediaPath('psd-professional');
          toast.success('🎨 PSD Professional workflow activated!', {
            description: 'Upload your PSD file to begin professional layer extraction'
          });
          break;
          
        case 'batch-processing':
          setSelectedMediaPath('batch-processing');
          setCurrentStep('batch-processing');
          toast.success('⚡ Batch Processing workflow activated!', {
            description: 'Upload multiple images for efficient batch card creation'
          });
          break;
          
        case 'smart-upload':
          setSelectedMediaPath('smart-upload');
          toast.success('🤖 Smart Upload workflow activated!', {
            description: 'AI-powered image analysis and template selection'
          });
          break;
          
        case 'crd-frame-generator':
          setSelectedMediaPath('crd-frame-generator');
          toast.success('🖼️ CRD Frame Generator activated!', {
            description: 'Create custom frames from your designs'
          });
          break;
          
        default:
          console.log('🎯 Unknown workflow type:', workflow);
          toast.info(`${workflow} workflow activated`);
      }
    }
  }, [searchParams, cardEditor, workflowActivated]);

  // Enhanced step validation with workflow-specific logic
  const validateCurrentStep = () => {
    console.log('🔍 Validating step:', currentStep, {
      hasImage: !!cardEditor.cardData.image_url,
      selectedMediaPath,
      selectedTemplate,
      generatedTemplate,
      isProcessing,
      isAnalyzing,
      workflowActivated
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
      
      case 'batch-processing':
        return !!cardEditor.cardData.image_url; // Allow continuation with uploaded images
      
      default:
        return false;
    }
  };

  // Enhanced step information with workflow context
  const getStepInfo = () => {
    const workflow = searchParams.get('workflow');
    const baseStepMap = {
      'upload': { number: 1, total: 4 },
      'path-selection': { number: 2, total: 4 },
      'template-selection': { number: 3, total: 4 },
      'psd-manager': { number: 3, total: 4 },
      'batch-processing': { number: 1, total: 3 } // Simplified workflow
    };
    
    // Adjust for specific workflows
    if (workflow === 'batch-processing') {
      return { number: 1, total: 3 };
    }
    
    return baseStepMap[currentStep] || { number: 1, total: 4 };
  };

  const canProceed = () => {
    const stepValid = validateCurrentStep();
    
    // Workflow-specific proceed logic
    if (currentStep === 'batch-processing') {
      return stepValid && cardEditor.cardData.image_url;
    }
    
    if (currentStep === 'path-selection') {
      if (['standard-card', 'interactive-card', 'quick-frame'].includes(selectedMediaPath)) {
        return stepValid;
      }
      return stepValid;
    }
    
    if (currentStep === 'template-selection') {
      return stepValid;
    }
    
    return stepValid;
  };

  // Enhanced step text with workflow awareness
  const getStepText = () => {
    const workflow = searchParams.get('workflow');
    
    switch (currentStep) {
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

  // Workflow-aware step indicator
  const WorkflowStepIndicator = ({ currentStep, workflow }: { currentStep: WorkflowStep; workflow: string | null }) => {
    const getWorkflowSteps = () => {
      switch (workflow) {
        case 'batch-processing':
          return [
            { id: 'batch-processing', label: 'Batch Upload', description: 'Upload multiple images', icon: Grid },
            { id: 'effects', label: 'Effects', description: 'Apply batch effects', icon: Sparkles },
            { id: 'publish', label: 'Publish', description: 'Export all cards', icon: FileImage }
          ];
        case 'psd-professional':
          return [
            { id: 'upload', label: 'PSD Upload', description: 'Upload PSD file', icon: Layers },
            { id: 'psd-manager', label: 'Layer Manager', description: 'Extract layers', icon: Grid },
            { id: 'effects', label: 'Effects', description: 'Apply effects', icon: Sparkles }
          ];
        default:
          return [
            { id: 'upload', label: 'Upload', description: 'Choose media', icon: FileImage },
            { id: 'path-selection', label: 'Workflow', description: 'Select path', icon: ArrowRight },
            { id: 'template-selection', label: 'Template', description: 'Pick design', icon: Grid }
          ];
      }
    };

    const steps = getWorkflowSteps();
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);

    return (
      <div className="flex items-center justify-center gap-3 py-6">
        {/* Workflow Badge */}
        {workflow && (
          <div className="bg-gradient-to-r from-crd-green/20 to-crd-blue/20 border border-crd-green/40 rounded-full px-4 py-2 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-crd-green" />
              <span className="text-crd-green font-medium text-sm">
                {workflow.replace('-', ' ').toUpperCase()} WORKFLOW
              </span>
            </div>
          </div>
        )}
        
        {/* Step indicators */}
        <div className="flex items-center gap-2">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            const Icon = step.icon;

            return (
              <div key={step.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-crd-green/30 to-crd-blue/30 border-2 border-crd-green/50 shadow-lg scale-105' 
                  : isCompleted 
                  ? 'bg-crd-green/15 border border-crd-green/30' 
                  : 'bg-crd-mediumGray/10 border border-crd-mediumGray/20'
              }`}>
                <div className={`w-6 h-6 flex items-center justify-center ${
                  isActive ? 'text-crd-green' : isCompleted ? 'text-crd-green' : 'text-crd-mediumGray'
                }`}>
                  {isCompleted ? '✓' : <Icon className="w-4 h-4" />}
                </div>
                <div>
                  <div className={`font-semibold text-sm ${
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
      </div>
    );
  };

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

      // Handle batch processing workflow
      if (workflow === 'batch-processing') {
        console.log('⚡ Processing for batch workflow');
        const imageUrl = URL.createObjectURL(file);
        cardEditor.updateCardField('image_url', imageUrl);
        setUploadProgress(100);
        setCurrentStep('batch-processing');
        
        toast.success('Image ready for batch processing!');
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
    else if (currentStep === 'batch-processing') setCurrentStep('upload');
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

      case 'batch-processing':
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-crd-green/10 to-crd-blue/10 border border-crd-green/30 rounded-xl p-8">
              <Grid className="w-16 h-16 text-crd-green mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-crd-white mb-2">Batch Processing Ready</h3>
              <p className="text-crd-lightGray mb-4">
                Your image is ready for batch processing. Continue to apply effects and finalize your cards.
              </p>
              {cardEditor.cardData.image_url && (
                <div className="max-w-xs mx-auto">
                  <img 
                    src={cardEditor.cardData.image_url} 
                    alt="Uploaded for batch processing"
                    className="w-full rounded-lg border border-crd-mediumGray/30"
                  />
                </div>
              )}
            </div>
          </div>
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

  const stepInfo = getStepInfo();
  const proceedEnabled = canProceed();
  const workflow = searchParams.get('workflow');

  return (
    <div className="space-y-8 relative z-10">
      {/* Enhanced Header with Workflow Context */}
      <div className="space-y-4">
        <StepHeader 
          currentStep={currentStep}
          mediaDetection={mediaDetection}
        />
        <WorkflowStepIndicator currentStep={currentStep} workflow={workflow} />
      </div>

      {/* Enhanced Navigation Section */}
      <div className="flex justify-between items-center py-6 border-y border-crd-green/20 bg-gradient-to-r from-transparent via-crd-green/5 to-transparent">
        <div className="text-lg text-crd-lightGray">
          <span className="text-crd-green font-semibold">Step {stepInfo.number} of {stepInfo.total}</span> - {getStepText()}
        </div>
        
        <div className="flex gap-4">
          {currentStep !== 'upload' && currentStep !== 'psd-manager' && currentStep !== 'batch-processing' && (
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
            {workflow === 'batch-processing' ? 'Continue to Batch Effects' : 'Continue to Effects'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </CRDButton>
        </div>
      </div>

      {/* Validation Feedback */}
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
