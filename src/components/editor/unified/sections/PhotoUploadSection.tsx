
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight, Sparkles, Upload, Image, Grid } from 'lucide-react';
import { useFreeAIAnalysis } from '@/hooks/useFreeAIAnalysis';
import { useTemplates } from '@/hooks/useTemplates';
import { MediaPathAnalyzer } from '@/lib/crdmkr/mediaPathAnalyzer';
import { ProfessionalPSDManager } from './components/ProfessionalPSDManager';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { UnifiedAnalysisResult } from '@/services/imageAnalysis/unifiedCardAnalyzer';

interface PhotoUploadSectionProps {
  cardEditor: ReturnType<typeof import('@/hooks/useCardEditor').useCardEditor>;
  onNext: () => void;
}

interface SimpleWorkflowState {
  uploadedFile: File | null;
  imageUrl: string;
  isProcessing: boolean;
  analysisResult: UnifiedAnalysisResult | null;
  selectedTemplate: string | null;
  showPSDManager: boolean;
}

export const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  cardEditor,
  onNext
}) => {
  const [state, setState] = useState<SimpleWorkflowState>({
    uploadedFile: null,
    imageUrl: cardEditor.cardData.image_url || '',
    isProcessing: false,
    analysisResult: null,
    selectedTemplate: null,
    showPSDManager: false
  });

  const { analyzeImage, isAnalyzing } = useFreeAIAnalysis();
  const { templates, isLoading: templatesLoading } = useTemplates();

  const updateState = useCallback((updates: Partial<SimpleWorkflowState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const processFile = useCallback(async (file: File) => {
    console.log('📁 Processing file:', file.name);
    
    updateState({ 
      uploadedFile: file, 
      isProcessing: true 
    });

    try {
      // Handle PSD files specially
      if (file.name.toLowerCase().endsWith('.psd')) {
        console.log('🎨 Detected PSD file - switching to professional workflow');
        const imageUrl = URL.createObjectURL(file);
        cardEditor.updateCardField('image_url', imageUrl);
        
        updateState({ 
          imageUrl,
          showPSDManager: true,
          isProcessing: false
        });
        
        toast.success('PSD file detected! Opening professional layer manager...');
        return;
      }

      // Standard image processing
      const imageUrl = URL.createObjectURL(file);
      cardEditor.updateCardField('image_url', imageUrl);
      updateState({ imageUrl });

      // Run AI analysis in background (silent smart detection)
      console.log('🤖 Running background analysis...');
      const result = await analyzeImage(imageUrl);
      
      if (result) {
        const analysisResult: UnifiedAnalysisResult = {
          title: result.suggestedTemplate || 'Trading Card',
          description: result.detectedText || 'A unique trading card.',
          rarity: result.suggestedRarity === 'Legendary' ? 'legendary' : 
                 result.suggestedRarity === 'Epic' ? 'epic' :
                 result.suggestedRarity === 'Rare' ? 'rare' :
                 result.suggestedRarity === 'Uncommon' ? 'uncommon' : 'common',
          estimatedValue: result.quality || 0,
          confidence: result.confidence / 100 || 0.5,
          category: result.contentType || 'Sports Card',
          type: result.contentType || 'Trading Card',
          tags: result.tags || [],
          specialFeatures: result.regions?.map(r => r.type) || [],
          sources: {
            ocr: !!result.detectedText,
            visual: result.confidence > 0,
            webSearch: false,
            database: false
          }
        };
        
        updateState({ analysisResult });
        console.log('✅ Background analysis complete');
      }

      toast.success('Image uploaded successfully! Choose a template below.');
      
    } catch (error) {
      console.error('Upload/Analysis error:', error);
      toast.error('Failed to process file');
    } finally {
      updateState({ isProcessing: false });
    }
  }, [cardEditor, analyzeImage, updateState]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
    event.target.value = '';
  }, [processFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  }, [processFile]);

  const handleTemplateSelect = useCallback((templateId: string) => {
    updateState({ selectedTemplate: templateId });
    cardEditor.updateCardField('template_id', templateId);
    
    const template = templates.find(t => t.id === templateId);
    if (template && template.template_data) {
      cardEditor.updateDesignMetadata('frame', template.template_data);
    }
    
    console.log('✅ Template selected:', templateId);
    toast.success('Template selected! Ready to continue.');
  }, [templates, cardEditor, updateState]);

  const handlePSDManagerCancel = useCallback(() => {
    updateState({
      showPSDManager: false,
      uploadedFile: null,
      imageUrl: '',
      isProcessing: false
    });
    cardEditor.updateCardField('image_url', '');
  }, [cardEditor, updateState]);

  const handleTemplateGenerated = useCallback((template: any) => {
    console.log('🎯 Professional template generated:', template);
    cardEditor.updateCardField('template_id', template.id);
    
    if (template.template_data) {
      cardEditor.updateDesignMetadata('frame', template.template_data);
    }
    
    updateState({ 
      showPSDManager: false,
      selectedTemplate: template.id 
    });
    
    toast.success('Professional CRD Frame created!', {
      description: 'Template is ready for your card creation workflow'
    });
  }, [cardEditor, updateState]);

  // Show PSD Manager if activated
  if (state.showPSDManager && state.uploadedFile) {
    return (
      <ProfessionalPSDManager
        psdFile={state.uploadedFile}
        userImage={state.imageUrl}
        onFrameGenerated={handleTemplateGenerated}
        onCancel={handlePSDManagerCancel}
      />
    );
  }

  const canProceed = !!(state.imageUrl && state.selectedTemplate);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-crd-white mb-4">Create Your Card</h2>
        <p className="text-crd-lightGray text-lg">
          Upload your image and choose a template to get started
        </p>
      </div>

      {/* Combined Upload & Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Upload Area */}
        <div className="space-y-6">
          {!state.imageUrl ? (
            <div
              className="border-2 border-dashed border-crd-mediumGray/30 rounded-xl h-80 flex flex-col items-center justify-center p-8 hover:border-crd-green/50 transition-colors cursor-pointer bg-crd-darker/20"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('photo-input')?.click()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-crd-mediumGray/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Upload className="w-8 h-8 text-crd-mediumGray" />
                </div>
                <h3 className="text-xl font-semibold text-crd-white mb-2">
                  Drop your image here
                </h3>
                <p className="text-crd-lightGray mb-6 max-w-sm">
                  Drag & drop an image file or click to browse. 
                  Supports JPG, PNG, and PSD files.
                </p>
                <CRDButton variant="primary">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </CRDButton>
              </div>
            </div>
          ) : (
            <Card className="bg-crd-darker border-crd-mediumGray/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-crd-green/20 rounded-lg flex items-center justify-center">
                    <Image className="w-6 h-6 text-crd-green" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-crd-white font-medium">Image Uploaded</h4>
                    <p className="text-crd-lightGray text-sm">
                      {state.uploadedFile?.name || 'Image ready for processing'}
                    </p>
                  </div>
                  {state.isProcessing && (
                    <div className="flex items-center gap-2 text-crd-green">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span className="text-sm">Processing...</span>
                    </div>
                  )}
                </div>
                
                <div className="aspect-video bg-crd-mediumGray/10 rounded-lg overflow-hidden">
                  <img 
                    src={state.imageUrl} 
                    alt="Uploaded" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="mt-4 flex gap-2">
                  <CRDButton
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('photo-input')?.click()}
                  >
                    Change Image
                  </CRDButton>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Results (if available) */}
          {state.analysisResult && state.analysisResult.confidence > 0.3 && (
            <Card className="bg-crd-mediumGray/10 border-crd-mediumGray/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-crd-green" />
                  <span className="text-crd-white text-sm font-medium">AI Analysis Complete</span>
                  <Badge variant="outline" className="text-crd-green border-crd-green/30 text-xs">
                    {Math.round(state.analysisResult.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="text-crd-lightGray text-sm">
                  {state.analysisResult.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Template Selection */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-crd-white mb-2 flex items-center gap-2">
              <Grid className="w-5 h-5" />
              Choose Template
            </h3>
            <p className="text-crd-lightGray">
              Select a design template for your card
            </p>
          </div>

          {templatesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-crd-green border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-crd-lightGray text-sm">Loading templates...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    state.selectedTemplate === template.id
                      ? 'border-crd-green bg-crd-green/10 shadow-lg'
                      : 'border-crd-mediumGray/30 hover:border-crd-green/50 bg-crd-darker/20'
                  }`}
                >
                  <div className="aspect-[5/7] bg-white rounded mb-2 overflow-hidden">
                    {template.preview_url ? (
                      <img 
                        src={template.preview_url} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-crd-mediumGray/20 to-crd-mediumGray/40 flex items-center justify-center">
                        <Grid className="w-6 h-6 text-crd-mediumGray" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <h4 className="text-crd-white font-medium text-sm mb-1">
                      {template.name}
                    </h4>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-crd-lightGray">
                        {template.category}
                      </span>
                      {template.is_premium && (
                        <Badge className="text-xs bg-crd-green/20 text-crd-green border-crd-green/30">
                          PRO
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div className="text-center pt-8 border-t border-crd-mediumGray/20">
        <CRDButton
          variant="primary"
          size="lg"
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-3 ${canProceed ? 'opacity-100' : 'opacity-50'}`}
        >
          Continue to Effects
          <ArrowRight className="w-5 h-5 ml-2" />
        </CRDButton>
        {!canProceed && (
          <p className="text-crd-lightGray text-sm mt-2">
            {!state.imageUrl ? 'Upload an image' : 'Select a template'} to continue
          </p>
        )}
      </div>

      {/* Hidden file input */}
      <input
        id="photo-input"
        type="file"
        accept="image/*,.psd"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};
