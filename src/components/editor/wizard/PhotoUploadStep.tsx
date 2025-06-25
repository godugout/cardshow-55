
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { AdvancedCropper } from '../AdvancedCropper';
import { BulkUploadOption } from '../BulkUploadOption';
import { PhotoPreview } from './components/PhotoPreview';
import { UploadActions } from './components/UploadActions';
import { ReadySection } from './components/ReadySection';
import { usePhotoUpload } from './hooks/usePhotoUpload';

interface PhotoUploadStepProps {
  selectedPhoto: string;
  onPhotoSelect: (photo: string) => void;
  onAnalysisComplete?: (analysis: any) => void;
  onBulkUpload?: () => void;
}

export const PhotoUploadStep = ({ 
  selectedPhoto, 
  onPhotoSelect, 
  onAnalysisComplete, 
  onBulkUpload 
}: PhotoUploadStepProps) => {
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

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
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

  return (
    <div className="space-y-6">
      {isAnalyzing && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-crd-green">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-sm">AI is analyzing your image...</span>
          </div>
        </div>
      )}
      
      <PhotoPreview selectedPhoto={selectedPhoto} imageDetails={imageDetails} />

      <UploadActions
        selectedPhoto={selectedPhoto}
        isAnalyzing={isAnalyzing}
        onChooseFile={() => document.getElementById('photo-input')?.click()}
        onAdvancedCrop={() => setShowAdvancedCrop(true)}
      />

      {/* Bulk Upload Option - Secondary placement */}
      {onBulkUpload && (
        <div className="mb-8">
          <BulkUploadOption onSelectBulkUpload={onBulkUpload} />
        </div>
      )}

      <ReadySection selectedPhoto={selectedPhoto} isAnalyzing={isAnalyzing} />

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
