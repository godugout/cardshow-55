
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Sparkles, Upload, Camera, FileImage, Zap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { EnhancedPhotoEditSection } from '../components/EnhancedPhotoEditSection';
import { CardBackDesigner } from '../components/CardBackDesigner';
import { usePhotoUpload } from '../hooks/usePhotoUpload';
import type { WizardMode } from '../UnifiedCardWizard';

interface UnifiedPhotoUploadStepProps {
  mode: WizardMode;
  selectedPhoto: string;
  selectedTemplate?: any;
  onPhotoSelect: (photo: string) => void;
  onAnalysisComplete?: (analysis: any) => void;
  onBackDesignUpdate?: (backDesign: any) => void;
}

export const UnifiedPhotoUploadStep = ({ 
  mode,
  selectedPhoto,
  selectedTemplate,
  onPhotoSelect, 
  onAnalysisComplete,
  onBackDesignUpdate
}: UnifiedPhotoUploadStepProps) => {
  const [imageFormat, setImageFormat] = useState<'square' | 'circle' | 'fullBleed'>('fullBleed');
  const [showBackDesigner, setShowBackDesigner] = useState(false);
  const { isAnalyzing, imageDetails, handleFileUpload } = usePhotoUpload(
    onPhotoSelect, 
    onAnalysisComplete
  );

  const getModeIcon = () => {
    switch (mode) {
      case 'quick': return <Zap className="w-5 h-5 text-crd-green" />;
      case 'advanced': return <Settings className="w-5 h-5 text-crd-blue" />;
      default: return <Upload className="w-5 h-5" />;
    }
  };

  const getModeDescription = () => {
    switch (mode) {
      case 'quick': 
        return 'Upload your photo and our AI will automatically analyze it and suggest the perfect template and details.';
      case 'advanced': 
        return 'Upload your photo with full control over cropping, templates, and manual customization options.';
      default: 
        return 'Upload your photo to get started with card creation.';
    }
  };

  if (showBackDesigner) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowBackDesigner(false)}
            className="mb-4 border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40"
          >
            ← Back to Photo Edit
          </Button>
        </div>
        <CardBackDesigner
          selectedTemplate={selectedTemplate}
          onBackDesignUpdate={onBackDesignUpdate || (() => {})}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mode-specific header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {getModeIcon()}
          <h2 className="text-2xl font-bold text-white">
            {selectedPhoto ? 'Edit Your Photo' : (mode === 'quick' ? 'Quick Upload' : mode === 'advanced' ? 'Advanced Upload' : 'Upload Photo')}
          </h2>
        </div>
        <p className="text-crd-lightGray">{getModeDescription()}</p>
      </div>

      {/* AI Analysis Status - more prominent in quick mode */}
      {isAnalyzing && (
        <div className={`text-center p-4 rounded-lg ${
          mode === 'quick' 
            ? 'bg-crd-green/20 border border-crd-green/40' 
            : 'bg-editor-border/20'
        }`}>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className={`w-5 h-5 animate-pulse ${
              mode === 'quick' ? 'text-crd-green' : 'text-crd-blue'
            }`} />
            <span className="text-white font-medium">
              {mode === 'quick' 
                ? 'AI is analyzing your image and setting everything up...' 
                : 'AI is analyzing your image...'
              }
            </span>
          </div>
          {mode === 'quick' && (
            <p className="text-sm text-crd-lightGray mt-1">
              This will only take a moment and will automatically fill in your card details
            </p>
          )}
        </div>
      )}

      {/* Enhanced Photo Edit Section */}
      <EnhancedPhotoEditSection
        selectedPhoto={selectedPhoto}
        selectedTemplate={selectedTemplate}
        imageFormat={imageFormat}
        onPhotoSelect={onPhotoSelect}
        onPhotoRemove={() => onPhotoSelect('')}
        onImageFormatChange={setImageFormat}
        isAnalyzing={isAnalyzing}
      />

      {/* Card Back Design Button */}
      {selectedPhoto && mode === 'advanced' && (
        <div className="text-center">
          <Button
            onClick={() => setShowBackDesigner(true)}
            variant="outline"
            className="border-crd-blue text-crd-blue hover:bg-crd-blue hover:text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Design Card Back
          </Button>
        </div>
      )}

      {/* Mode-specific features for non-uploaded state */}
      {!selectedPhoto && mode === 'advanced' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-crd-mediumGray/20 rounded-lg border border-crd-mediumGray/50">
            <div className="flex items-center gap-3 mb-2">
              <Camera className="w-5 h-5 text-crd-blue" />
              <span className="text-white font-medium">Take Photo</span>
            </div>
            <p className="text-crd-lightGray text-sm mb-3">
              Use your device camera to capture a new photo
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-white"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.capture = 'environment';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleFileUpload(file);
                };
                input.click();
              }}
            >
              <Camera className="w-4 h-4 mr-2" />
              Open Camera
            </Button>
          </div>

          <div className="p-4 bg-crd-mediumGray/20 rounded-lg border border-crd-mediumGray/50">
            <div className="flex items-center gap-3 mb-2">
              <FileImage className="w-5 h-5 text-crd-blue" />
              <span className="text-white font-medium">Stock Photos</span>
            </div>
            <p className="text-crd-lightGray text-sm mb-3">
              Browse our collection of stock photos
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-white"
              onClick={() => toast.info('Stock photo library coming soon!')}
            >
              <FileImage className="w-4 h-4 mr-2" />
              Browse Stock
            </Button>
          </div>
        </div>
      )}

      {/* Ready state for quick mode */}
      {mode === 'quick' && selectedPhoto && !isAnalyzing && (
        <div className="bg-crd-green/10 border border-crd-green/30 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-crd-green mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Ready for AI Magic!</span>
          </div>
          <p className="text-sm text-crd-lightGray">
            Click "Next" and we'll automatically analyze your photo and set up your card
          </p>
        </div>
      )}
    </div>
  );
};
