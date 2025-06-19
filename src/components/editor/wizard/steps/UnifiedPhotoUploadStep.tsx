
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Sparkles, Upload, Camera, FileImage, Zap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AdvancedCropper } from '../../AdvancedCropper';
import { usePhotoUpload } from '../hooks/usePhotoUpload';
import type { WizardMode } from '../UnifiedCardWizard';

interface UnifiedPhotoUploadStepProps {
  mode: WizardMode;
  selectedPhoto: string;
  onPhotoSelect: (photo: string) => void;
  onAnalysisComplete?: (analysis: any) => void;
}

export const UnifiedPhotoUploadStep = ({ 
  mode,
  selectedPhoto, 
  onPhotoSelect, 
  onAnalysisComplete
}: UnifiedPhotoUploadStepProps) => {
  const [showAdvancedCrop, setShowAdvancedCrop] = useState(false);
  const { isAnalyzing, imageDetails, handleFileUpload } = usePhotoUpload(
    onPhotoSelect, 
    onAnalysisComplete
  );

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      await handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
    event.target.value = '';
  };

  const handleAdvancedCropComplete = (crops: { main?: string; frame?: string; elements?: string[] }) => {
    if (crops.main) {
      onPhotoSelect(crops.main);
      toast.success('Advanced crop applied to card!');
    }
    setShowAdvancedCrop(false);
  };

  // Show advanced cropper if active
  if (showAdvancedCrop && selectedPhoto) {
    return (
      <div className="h-[600px]">
        <AdvancedCropper
          imageUrl={selectedPhoto}
          onCropComplete={handleAdvancedCropComplete}
          onCancel={() => setShowAdvancedCrop(false)}
          aspectRatio={2.5 / 3.5}
        />
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      {/* Mode-specific header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {getModeIcon()}
          <h2 className="text-2xl font-bold text-white">
            {mode === 'quick' ? 'Quick Upload' : mode === 'advanced' ? 'Advanced Upload' : 'Upload Photo'}
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

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          isDragActive 
            ? 'border-crd-green bg-crd-green/10' 
            : selectedPhoto 
              ? 'border-crd-green bg-crd-green/5' 
              : 'border-crd-mediumGray bg-crd-mediumGray/10 hover:border-crd-green'
        }`}
      >
        <input {...getInputProps()} />
        
        {selectedPhoto ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={selectedPhoto}
                alt="Uploaded photo"
                className="max-w-full max-h-64 rounded-lg shadow-lg"
              />
              <div className="absolute top-2 right-2 bg-crd-green text-black px-2 py-1 rounded-md text-xs font-medium">
                ✓ Ready
              </div>
            </div>
            
            {imageDetails && (
              <div className="text-sm text-crd-lightGray">
                {imageDetails.width} × {imageDetails.height} • {imageDetails.fileSize}
              </div>
            )}
            
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => document.getElementById('photo-input')?.click()}
                className="bg-transparent border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
              
              {mode === 'advanced' && (
                <Button
                  onClick={() => setShowAdvancedCrop(true)}
                  className="bg-crd-blue hover:bg-crd-blue/90 text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced Crop
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-crd-mediumGray rounded-full flex items-center justify-center">
                <FileImage className="w-10 h-10 text-crd-lightGray" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-white font-medium">
                {isDragActive ? 'Drop your photo here!' : 'Drop your photo here, or click to browse'}
              </p>
              <p className="text-crd-lightGray text-sm">
                Supports JPG, PNG, WebP • Max 10MB • Recommended: 1080x1080 or higher
              </p>
            </div>
            <Button
              onClick={() => document.getElementById('photo-input')?.click()}
              className={`${
                mode === 'quick' 
                  ? 'bg-crd-green hover:bg-crd-green/90 text-black' 
                  : 'bg-crd-blue hover:bg-crd-blue/90 text-white'
              } font-medium`}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Photo
            </Button>
          </div>
        )}
      </div>

      {/* Mode-specific features */}
      {mode === 'advanced' && !selectedPhoto && (
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

      {/* Hidden file input */}
      <input
        id="photo-input"
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
    </div>
  );
};
