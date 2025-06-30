
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight, Sparkles, Upload, Image, Grid, CheckCircle } from 'lucide-react';
import { useFreeAIAnalysis } from '@/hooks/useFreeAIAnalysis';
import { useTemplates } from '@/hooks/useTemplates';
import { MediaPathAnalyzer } from '@/lib/crdmkr/mediaPathAnalyzer';
import { ProfessionalPSDManager } from './components/ProfessionalPSDManager';
import { CardPreviewRenderer } from './components/CardPreviewRenderer';
import { EnhancedImageCropper } from './components/EnhancedImageCropper';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { UnifiedAnalysisResult } from '@/services/imageAnalysis/unifiedCardAnalyzer';

interface PhotoUploadSectionProps {
  cardEditor: ReturnType<typeof import('@/hooks/useCardEditor').useCardEditor>;
  onNext: () => void;
}

interface WorkflowState {
  uploadedFile: File | null;
  originalImageUrl: string;
  croppedImageUrl: string;
  isProcessing: boolean;
  analysisResult: UnifiedAnalysisResult | null;
  selectedTemplate: any;
  showPSDManager: boolean;
  showCropper: boolean;
  step: 'upload' | 'crop' | 'preview' | 'ready';
}

export const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  cardEditor,
  onNext
}) => {
  const [state, setState] = useState<WorkflowState>({
    uploadedFile: null,
    originalImageUrl: cardEditor.cardData.image_url || '',
    croppedImageUrl: '',
    isProcessing: false,
    analysisResult: null,
    selectedTemplate: null,
    showPSDManager: false,
    showCropper: false,
    step: 'upload'
  });

  const { analyzeImage, isAnalyzing } = useFreeAIAnalysis();
  const { templates, isLoading: templatesLoading } = useTemplates();

  const updateState = useCallback((updates: Partial<WorkflowState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const processFile = useCallback(async (file: File) => {
    console.log('📁 Processing file:', file.name);
    
    updateState({ 
      uploadedFile: file, 
      isProcessing: true,
      step: 'upload'
    });

    try {
      // Handle PSD files specially
      if (file.name.toLowerCase().endsWith('.psd')) {
        console.log('🎨 Detected PSD file - switching to professional workflow');
        const imageUrl = URL.createObjectURL(file);
        cardEditor.updateCardField('image_url', imageUrl);
        
        updateState({ 
          originalImageUrl: imageUrl,
          showPSDManager: true,
          isProcessing: false
        });
        
        toast.success('PSD file detected! Opening professional layer manager...');
        return;
      }

      // Standard image processing - move to crop step
      const imageUrl = URL.createObjectURL(file);
      updateState({ 
        originalImageUrl: imageUrl,
        showCropper: true,
        step: 'crop',
        isProcessing: false
      });

      // Run AI analysis in background
      console.log('🤖 Running background analysis...');
      try {
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
        }
      } catch (analysisError) {
        console.warn('Background analysis failed, continuing without it:', analysisError);
      }

      toast.success('Image uploaded! Crop it to perfection for your card.');
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to process file');
      updateState({ isProcessing: false, step: 'upload' });
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

  const handleCropComplete = useCallback((croppedImageUrl: string) => {
    console.log('✅ Crop completed, moving to preview step');
    updateState({ 
      croppedImageUrl,
      showCropper: false,
      step: 'preview'
    });
    
    cardEditor.updateCardField('image_url', croppedImageUrl);
    cardEditor.updateCardField('thumbnail_url', croppedImageUrl);
    
    // Auto-select default template
    const defaultTemplate = {
      id: 'classic-baseball',
      name: 'Classic Baseball',
      template_data: {
        component: 'ClassicBaseballTemplate',
        colors: {
          primary: '#1a472a',
          secondary: '#2d5a3d',
          accent: '#4ade80',
          text: '#ffffff'
        }
      }
    };
    
    updateState({ selectedTemplate: defaultTemplate, step: 'ready' });
    cardEditor.updateCardField('template_id', defaultTemplate.id);
    cardEditor.updateDesignMetadata('frame', defaultTemplate.template_data);
    
    toast.success('Perfect crop! Template applied and ready to continue.');
  }, [cardEditor, updateState]);

  const handleTemplateChange = useCallback((newTemplate: any) => {
    updateState({ selectedTemplate: newTemplate });
    cardEditor.updateCardField('template_id', newTemplate.id);
    
    if (newTemplate.template_data) {
      cardEditor.updateDesignMetadata('frame', newTemplate.template_data);
    }
    
    console.log('✅ Template switched to:', newTemplate.id);
    toast.success(`Switched to ${newTemplate.name}!`);
  }, [cardEditor, updateState]);

  const handlePSDManagerCancel = useCallback(() => {
    updateState({
      showPSDManager: false,
      uploadedFile: null,
      originalImageUrl: '',
      isProcessing: false,
      step: 'upload'
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
      selectedTemplate: template,
      step: 'ready'
    });
    
    toast.success('Professional CRD Frame created!');
  }, [cardEditor, updateState]);

  const canProceed = state.step === 'ready' && state.croppedImageUrl && state.selectedTemplate;
  const displayImageUrl = state.croppedImageUrl || state.originalImageUrl;

  // Show PSD Manager if activated
  if (state.showPSDManager && state.uploadedFile) {
    return (
      <ProfessionalPSDManager
        psdFile={state.uploadedFile}
        userImage={state.originalImageUrl}
        onFrameGenerated={handleTemplateGenerated}
        onCancel={handlePSDManagerCancel}
      />
    );
  }

  // Show Cropper if activated
  if (state.showCropper && state.originalImageUrl) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-crd-white mb-4">Crop Your Card Image</h2>
          <p className="text-crd-lightGray text-lg">
            Position and size your image perfectly for your trading card
          </p>
        </div>

        <EnhancedImageCropper
          imageUrl={state.originalImageUrl}
          onCropComplete={handleCropComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-8 mb-8">
        <div className={`flex items-center gap-2 ${state.step === 'upload' ? 'text-crd-green' : state.step !== 'upload' ? 'text-crd-green' : 'text-crd-mediumGray'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${state.step !== 'upload' ? 'bg-crd-green' : 'bg-crd-mediumGray/20 border-2 border-crd-green'}`}>
            {state.step !== 'upload' ? <CheckCircle className="w-5 h-5 text-white" /> : '1'}
          </div>
          <span className="font-medium">Upload</span>
        </div>
        
        <div className="w-12 h-px bg-crd-mediumGray/30"></div>
        
        <div className={`flex items-center gap-2 ${state.step === 'crop' ? 'text-crd-green' : state.step === 'preview' || state.step === 'ready' ? 'text-crd-green' : 'text-crd-mediumGray'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${state.step === 'preview' || state.step === 'ready' ? 'bg-crd-green' : state.step === 'crop' ? 'bg-crd-mediumGray/20 border-2 border-crd-green' : 'bg-crd-mediumGray/20'}`}>
            {state.step === 'preview' || state.step === 'ready' ? <CheckCircle className="w-5 h-5 text-white" /> : '2'}
          </div>
          <span className="font-medium">Crop</span>
        </div>
        
        <div className="w-12 h-px bg-crd-mediumGray/30"></div>
        
        <div className={`flex items-center gap-2 ${state.step === 'ready' ? 'text-crd-green' : 'text-crd-mediumGray'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${state.step === 'ready' ? 'bg-crd-green' : 'bg-crd-mediumGray/20'}`}>
            {state.step === 'ready' ? <CheckCircle className="w-5 h-5 text-white" /> : '3'}
          </div>
          <span className="font-medium">Ready</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-crd-white mb-4">Create Your Card</h2>
        <p className="text-crd-lightGray text-lg">
          {state.step === 'upload' && 'Upload your image to get started'}
          {state.step === 'crop' && 'Crop your image for the perfect card'}
          {state.step === 'preview' && 'Review your card preview'}
          {state.step === 'ready' && 'Your card is ready for customization!'}
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column - Upload Status or Controls */}
        <div className="space-y-6">
          {!displayImageUrl ? (
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
                    <h4 className="text-crd-white font-medium">
                      {state.step === 'ready' ? 'Card Ready!' : 
                       state.step === 'preview' ? 'Image Processed' : 
                       'Image Uploaded'}
                    </h4>
                    <p className="text-crd-lightGray text-sm">
                      {state.uploadedFile?.name || 'Image ready for processing'}
                    </p>
                  </div>
                  {state.step === 'ready' && (
                    <Badge className="bg-crd-green/20 text-crd-green border-crd-green/30">
                      Ready!
                    </Badge>
                  )}
                </div>
                
                <div className="aspect-video bg-crd-mediumGray/10 rounded-lg overflow-hidden">
                  <img 
                    src={displayImageUrl} 
                    alt="Uploaded" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="mt-4 flex gap-2">
                  {state.step !== 'ready' && (
                    <CRDButton
                      variant="primary"
                      size="sm"
                      onClick={() => updateState({ showCropper: true })}
                    >
                      {state.step === 'upload' ? 'Crop Image' : 'Re-crop'}
                    </CRDButton>
                  )}
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
        </div>

        {/* Right Column - Large Card Preview */}
        {state.step === 'ready' && displayImageUrl && state.selectedTemplate && (
          <div className="space-y-4 sticky top-8">
            <div>
              <h3 className="text-xl font-bold text-crd-white mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-crd-green" />
                Your Card Preview
              </h3>
              <p className="text-crd-lightGray">
                Full image with CRD frame overlay - Switch frames with arrows
              </p>
            </div>
            
            <CardPreviewRenderer
              imageUrl={displayImageUrl}
              template={state.selectedTemplate}
              onTemplateChange={handleTemplateChange}
              enableFrameSwitching={true}
              size="large"
              className="w-full"
            />
            
            <div className="text-center">
              <Badge className="bg-crd-green/20 text-crd-green border-crd-green/30">
                Ready for Effects & Customization!
              </Badge>
            </div>
          </div>
        )}
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
          Continue to Effects & Customization
          <ArrowRight className="w-5 h-5 ml-2" />
        </CRDButton>
        {!canProceed && (
          <p className="text-crd-lightGray text-sm mt-2">
            {state.step === 'upload' ? 'Upload an image to continue' : 
             state.step === 'crop' ? 'Crop your image to continue' : 
             'Processing...'}
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
