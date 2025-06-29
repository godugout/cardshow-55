
import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { CRDButton } from '@/components/ui/design-system/Button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useFreeAIAnalysis } from '@/hooks/useFreeAIAnalysis';
import { useTemplates } from '@/hooks/useTemplates';
import { MediaPathAnalyzer } from '@/lib/crdmkr/mediaPathAnalyzer';

import { AIToolsPanel } from './components/AIToolsPanel';
import { UploadStep } from './components/UploadStep';
import { PathSelectionStep } from './components/PathSelectionStep';
import { TemplateSelectionStep } from './components/TemplateSelectionStep';
import { StepHeader } from './components/StepHeader';
import { StepIndicator } from './components/StepIndicator';

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
  const [showAITools, setShowAITools] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [mediaDetection, setMediaDetection] = useState<any>(null);
  const [selectedMediaPath, setSelectedMediaPath] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'upload' | 'path-selection' | 'template-selection'>('upload');
  
  const { analyzeImage, isAnalyzing } = useFreeAIAnalysis();
  const { templates, isLoading: templatesLoading } = useTemplates();

  const processFile = useCallback(async (file: File) => {
    console.log('📁 Processing file:', file.name);
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Step 1: Detect media format and capabilities
      console.log('🔍 Analyzing media format...');
      const detection = await MediaPathAnalyzer.analyzeFile(file);
      setMediaDetection(detection);
      setSelectedMediaPath(detection.recommendedPath);
      
      // Step 2: Create preview
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

      // Step 3: Run AI analysis
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
        
        // Move to path selection step
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
  }, [cardEditor, analyzeImage]);

  const handlePathSelect = (pathId: string) => {
    setSelectedMediaPath(pathId);
    console.log('🎯 Selected media path:', pathId);
    
    // Store workflow selection in card data
    cardEditor.updateDesignMetadata('workflowPath', pathId);
    
    // Move to template selection for standard workflows
    if (pathId === 'standard-card' || pathId === 'interactive-card' || pathId === 'quick-frame') {
      setCurrentStep('template-selection');
    } else {
      // For advanced workflows (PSD, GIF), we might skip template selection or use different logic
      toast.success(`${pathId} workflow selected! Ready to proceed.`);
      setShowAITools(true);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    cardEditor.updateCardField('template_id', templateId);
    
    const template = templates.find(t => t.id === templateId);
    if (template && template.template_data) {
      cardEditor.updateDesignMetadata('frame', template.template_data);
    }
    
    setShowAITools(true);
    toast.success('Template selected! Ready to proceed.');
  };

  const canProceed = cardEditor.cardData.image_url && 
    (selectedTemplate || (selectedMediaPath && !['standard-card', 'interactive-card', 'quick-frame'].includes(selectedMediaPath))) &&
    !isProcessing && !isAnalyzing;

  const getStepText = () => {
    switch (currentStep) {
      case 'upload':
        return 'Upload your media file';
      case 'path-selection':
        return 'Choose your workflow';
      case 'template-selection':
        return 'Select template';
      default:
        return canProceed ? 'Ready to continue!' : 'Complete setup';
    }
  };

  const handleBack = () => {
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

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 relative z-10">
      {/* Enhanced Header with Progress */}
      <div className="space-y-4">
        <StepHeader 
          currentStep={currentStep}
          mediaDetection={mediaDetection}
        />
        <StepIndicator currentStep={currentStep} />
      </div>

      {/* Navigation Section */}
      <div className="flex justify-between items-center py-4 border-y border-crd-mediumGray/20">
        <div className="text-sm text-crd-lightGray">
          Step 1 of 4 - {getStepText()}
        </div>
        
        <div className="flex gap-3">
          {currentStep !== 'upload' && (
            <CRDButton 
              onClick={handleBack}
              variant="outline"
              className="min-w-[100px] border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </CRDButton>
          )}
          
          <CRDButton 
            onClick={onNext} 
            disabled={!canProceed}
            className="min-w-[120px] bg-crd-green hover:bg-crd-green/90 text-black"
          >
            Next Step
            <ArrowRight className="w-4 h-4 ml-2" />
          </CRDButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[400px]">
        {renderCurrentStep()}
      </div>

      {/* AI Tools Panel */}
      {showAITools && cardEditor.cardData.image_url && imageAnalysis && (
        <AIToolsPanel
          analysisData={imageAnalysis}
          onEnhance={() => {}}
          onCreateFromPSD={() => {}}
        />
      )}
    </div>
  );
};
