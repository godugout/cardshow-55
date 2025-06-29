import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, Crown, Gem, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { useFreeAIAnalysis } from '@/hooks/useFreeAIAnalysis';
import { useTemplates } from '@/hooks/useTemplates';
import { MediaPathAnalyzer } from '@/lib/crdmkr/mediaPathAnalyzer';

import { PhotoDropzone } from './components/PhotoDropzone';
import { PhotoPreview } from './components/PhotoPreview';
import { UploadProgress } from './components/UploadProgress';
import { AIToolsPanel } from './components/AIToolsPanel';
import { MediaPathDetector } from './components/MediaPathDetector';

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

  const getRarityIcon = (price: number = 0) => {
    if (price >= 20) return <Crown className="h-4 w-4 text-orange-400" />;
    if (price >= 5) return <Gem className="h-4 w-4 text-purple-400" />;
    return <Star className="h-4 w-4 text-blue-400" />;
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
          <div className="relative">
            {isProcessing || isAnalyzing ? (
              <div className="border-2 border-dashed border-crd-green/50 rounded-xl p-6 text-center min-h-[280px] flex flex-col items-center justify-center">
                <UploadProgress progress={uploadProgress} />
                {isAnalyzing && (
                  <p className="text-crd-lightGray mt-4">Running smart media analysis...</p>
                )}
              </div>
            ) : cardEditor.cardData.image_url ? (
              <div className="border-2 border-dashed border-crd-green rounded-xl p-6 text-center bg-crd-green/5 min-h-[280px] flex flex-col items-center justify-center">
                <PhotoPreview 
                  imageUrl={cardEditor.cardData.image_url}
                  onReplace={() => processFile}
                />
              </div>
            ) : (
              <PhotoDropzone 
                onFileSelect={processFile}
                disabled={isProcessing || isAnalyzing}
              />
            )}
          </div>
        );

      case 'path-selection':
        return mediaDetection ? (
          <MediaPathDetector
            detectedFormat={mediaDetection.format}
            fileSize={cardEditor.cardData.image_url ? 1024 * 1024 : 0} // Placeholder size
            fileName={mediaDetection.format}
            onPathSelect={handlePathSelect}
            selectedPath={selectedMediaPath}
          />
        ) : null;

      case 'template-selection':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-crd-white">Choose Your Frame</h4>
                <p className="text-crd-lightGray">Select a template that matches your card's style</p>
              </div>
              {imageAnalysis?.suggestedTemplate && (
                <Badge variant="outline" className="bg-crd-green/10 text-crd-green border-crd-green/30">
                  AI Suggests: {imageAnalysis.suggestedTemplate}
                </Badge>
              )}
            </div>

            {templatesLoading ? (
              <div className="grid grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[5/7] bg-crd-mediumGray/20 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {templates.slice(0, 6).map((template) => {
                  const isSelected = selectedTemplate === template.id;
                  
                  return (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        isSelected 
                          ? 'ring-2 ring-crd-green bg-crd-green/10' 
                          : 'bg-crd-mediumGray/20 hover:bg-crd-mediumGray/30'
                      } border-crd-mediumGray/30`}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <CardContent className="p-4">
                        <div className="aspect-[5/7] rounded-lg overflow-hidden mb-3 bg-crd-darkGray">
                          {template.preview_url ? (
                            <img 
                              src={template.preview_url} 
                              alt={template.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-600 rounded mx-auto mb-2" />
                                <p className="text-xs text-crd-mediumGray">Preview</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-crd-white text-sm truncate">{template.name}</h5>
                            <div className="flex items-center">
                              {getRarityIcon()}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-crd-green font-medium">
                              {template.is_premium ? 'Premium' : 'Free'}
                            </span>
                            <span className="text-crd-mediumGray">{template.usage_count || 0} uses</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 relative z-10">
      {/* Enhanced Header with Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-crd-white">
              {currentStep === 'upload' && 'Upload & Analyze Your Media'}
              {currentStep === 'path-selection' && 'Choose Your Workflow'}
              {currentStep === 'template-selection' && 'Select Template'}
            </h3>
            <p className="text-crd-lightGray">
              {currentStep === 'upload' && 'Upload your file and let our AI detect the best workflow'}
              {currentStep === 'path-selection' && 'Select the approach that matches your goals'}
              {currentStep === 'template-selection' && 'Choose a frame template for your card'}
            </p>
          </div>
          
          {mediaDetection && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-crd-green" />
              <span className="text-crd-green font-medium">{mediaDetection.format}</span>
            </div>
          )}
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-4">
          {['upload', 'path-selection', 'template-selection'].map((step, index) => {
            const isActive = currentStep === step;
            const isCompleted = ['upload', 'path-selection', 'template-selection'].indexOf(currentStep) > index;
            
            return (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isCompleted ? 'bg-crd-green text-black' :
                  isActive ? 'bg-crd-green/20 text-crd-green border-2 border-crd-green' :
                  'bg-crd-mediumGray/20 text-crd-lightGray'
                }`}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-12 h-0.5 ${
                    isCompleted ? 'bg-crd-green' : 'bg-crd-mediumGray/30'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Section - MOVED HERE */}
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
