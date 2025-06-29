
import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Crown, Gem, Star, Sparkles } from 'lucide-react';
import { useFreeAIAnalysis } from '@/hooks/useFreeAIAnalysis';
import { useTemplates } from '@/hooks/useTemplates';

import { PhotoDropzone } from './components/PhotoDropzone';
import { PhotoPreview } from './components/PhotoPreview';
import { UploadProgress } from './components/UploadProgress';
import { AIToolsPanel } from './components/AIToolsPanel';

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
  
  const { analyzeImage, isAnalyzing } = useFreeAIAnalysis();
  const { templates, isLoading: templatesLoading } = useTemplates();

  const processFile = useCallback(async (file: File) => {
    console.log('📁 Processing file:', file.name);
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 50) {
            clearInterval(progressInterval);
            return 50;
          }
          return prev + 10;
        });
      }, 200);

      // Create object URL for preview  
      const imageUrl = URL.createObjectURL(file);
      cardEditor.updateCardField('image_url', imageUrl);

      // Run real AI analysis
      console.log('🤖 Starting real AI analysis...');
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
        setShowAITools(true);
        clearInterval(progressInterval);
        
        console.log('✅ Real AI analysis complete:', result);
        toast.success(`Image analyzed! Detected: ${result.contentType} (${result.confidence}% confidence)`);
      } else {
        throw new Error('Analysis failed');
      }

    } catch (error) {
      console.error('Upload/Analysis error:', error);
      toast.error('Failed to analyze image');
    } finally {
      setIsProcessing(false);
    }
  }, [cardEditor, analyzeImage]);

  const handleAIEnhance = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Image enhanced with AI!');
    }, 1500);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    cardEditor.updateCardField('template_id', templateId);
    
    const template = templates.find(t => t.id === templateId);
    if (template && template.template_data) {
      cardEditor.updateDesignMetadata('frame', template.template_data);
    }
    
    toast.success('Template selected!');
  };

  const getRarityIcon = (price: number = 0) => {
    if (price >= 20) return <Crown className="h-4 w-4 text-orange-400" />;
    if (price >= 5) return <Gem className="h-4 w-4 text-purple-400" />;
    return <Star className="h-4 w-4 text-blue-400" />;
  };

  const canProceed = cardEditor.cardData.image_url && selectedTemplate && !isProcessing && !isAnalyzing;

  return (
    <div className="space-y-8 relative z-10">
      {/* Upload Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-crd-white">Upload & Choose Template</h3>
        <p className="text-crd-lightGray">Upload your image and select a frame template</p>
        
        <div className="relative">
          {isProcessing || isAnalyzing ? (
            <div className="border-2 border-dashed border-crd-green/50 rounded-xl p-6 text-center min-h-[280px] flex flex-col items-center justify-center">
              <UploadProgress progress={uploadProgress} />
              {isAnalyzing && (
                <p className="text-crd-lightGray mt-4">Running AI analysis...</p>
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

        {showAITools && cardEditor.cardData.image_url && imageAnalysis && (
          <AIToolsPanel
            analysisData={imageAnalysis}
            onEnhance={handleAIEnhance}
            onCreateFromPSD={() => {}}
          />
        )}
      </div>

      {/* Template Selection Section - Only show after image is uploaded */}
      {cardEditor.cardData.image_url && (
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

          {selectedTemplate && (
            <div className="bg-crd-green/10 border border-crd-green/30 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-crd-green" />
                <span className="text-crd-white font-medium">Template Selected!</span>
              </div>
              <p className="text-crd-lightGray text-sm mt-1">
                Ready to proceed to the next step with your chosen template.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-crd-mediumGray/20">
        <div className="text-sm text-crd-lightGray">
          Step 1 of 4 - {canProceed ? 'Ready to continue!' : 'Upload image and select template'}
        </div>
        
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
  );
};
