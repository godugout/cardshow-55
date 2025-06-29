
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
import { StepIndicator } from './components/StepIndicator';

interface PhotoUploadSectionProps {
  cardEditor: ReturnType<typeof import('@/hooks/useCardEditor').useCardEditor>;
  onNext: () => void;
}

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
  const [currentStep, setCurrentStep] = useState<'upload' | 'path-selection' | 'template-selection' | 'psd-manager'>('upload');
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [generatedTemplate, setGeneratedTemplate] = useState<any>(null);
  const [showPSDManager, setShowPSDManager] = useState(false);
  
  const { analyzeImage, isAnalyzing } = useFreeAIAnalysis();
  const { templates, isLoading: templatesLoading } = useTemplates();

  // Handle URL parameters for auto-triggering PSD workflow
  useEffect(() => {
    const source = searchParams.get('source');
    const workflow = searchParams.get('workflow');
    
    if (source === 'crdmkr' && workflow === 'psd-professional') {
      console.log('🎯 Auto-activating PSD Professional workflow');
      // Set the media path and prepare for PSD upload
      setSelectedMediaPath('psd-professional');
      setCurrentStep('upload');
      
      // Update card editor metadata
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
      // Check if this is specifically for PSD professional workflow
      const workflow = searchParams.get('workflow');
      const isPSDWorkflow = workflow === 'psd-professional' || file.name.toLowerCase().endsWith('.psd');
      
      if (isPSDWorkflow) {
        console.log('🎨 Detected PSD professional workflow');
        setShowPSDManager(true);
        setCurrentStep('psd-manager');
        setUploadProgress(100);
        
        // Create image URL for preview
        const imageUrl = URL.createObjectURL(file);
        cardEditor.updateCardField('image_url', imageUrl);
        
        toast.success('PSD file ready for professional processing!');
        return;
      }

      // Regular file processing
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

      // AI analysis
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
    } else if (pathId === 'standard-card' || pathId === 'interactive-card' || pathId === 'quick-frame') {
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
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    cardEditor.updateCardField('template_id', templateId);
    
    const template = templates.find(t => t.id === templateId);
    if (template && template.template_data) {
      cardEditor.updateDesignMetadata('frame', template.template_data);
    }
    
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

  const canProceed = cardEditor.cardData.image_url && 
    (selectedTemplate || generatedTemplate || (selectedMediaPath && !['standard-card', 'interactive-card', 'quick-frame'].includes(selectedMediaPath))) &&
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

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 relative z-10">
      {/* Enhanced Header */}
      <div className="space-y-4">
        <StepHeader 
          currentStep={currentStep}
          mediaDetection={mediaDetection}
        />
        <StepIndicator currentStep={currentStep} />
      </div>

      {/* Navigation Section */}
      <div className="flex justify-between items-center py-6 border-y border-crd-green/20 bg-gradient-to-r from-transparent via-crd-green/5 to-transparent">
        <div className="text-lg text-crd-lightGray">
          <span className="text-crd-green font-semibold">Step 1 of 4</span> - {getStepText()}
        </div>
        
        <div className="flex gap-4">
          {currentStep !== 'upload' && (
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
            disabled={!canProceed}
            className="min-w-[140px] bg-gradient-to-r from-crd-green to-crd-blue hover:from-crd-green/90 hover:to-crd-blue/90 text-black font-bold shadow-xl"
          >
            Continue to Effects
            <ArrowRight className="w-5 h-5 ml-2" />
          </CRDButton>
        </div>
      </div>

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
