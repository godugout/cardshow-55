
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Sparkles, Zap, Settings } from 'lucide-react';
import { EnhancedPhotoEditSection } from '../components/EnhancedPhotoEditSection';
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
  const { isAnalyzing, imageDetails, handleFileUpload } = usePhotoUpload(
    onPhotoSelect, 
    onAnalysisComplete
  );

  const getModeIcon = () => {
    switch (mode) {
      case 'quick': return <Zap className="w-5 h-5 text-crd-green" />;
      case 'advanced': return <Settings className="w-5 h-5 text-crd-blue" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Status - only show when analyzing */}
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
              AI analyzing your image...
            </span>
          </div>
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

      {/* Ready state for quick mode */}
      {mode === 'quick' && selectedPhoto && !isAnalyzing && (
        <div className="bg-crd-green/10 border border-crd-green/30 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-crd-green mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Ready!</span>
          </div>
          <p className="text-sm text-crd-lightGray">
            Click "Next" to continue with your card
          </p>
        </div>
      )}
    </div>
  );
};
