
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AdvancedCropper } from '../AdvancedCropper';
import { BulkUploadOption } from '../BulkUploadOption';
import { PhotoPreview } from './PhotoPreview';
import { UploadActions } from './UploadActions';
import { useImageProcessor } from './ImageProcessor';
import { toast } from 'sonner';

interface PhotoUploadStepProps {
  selectedPhoto: string;
  onPhotoSelect: (photo: string) => void;
  onAnalysisComplete?: (analysis: any) => void;
  onBulkUpload?: () => void;
}

export const PhotoUploadStep = ({ selectedPhoto, onPhotoSelect, onAnalysisComplete, onBulkUpload }: PhotoUploadStepProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvancedCrop, setShowAdvancedCrop] = useState(false);
  const [imageDetails, setImageDetails] = useState<{
    dimensions: { width: number; height: number };
    aspectRatio: number;
    fileSize: string;
  } | null>(null);

  const { handleFileUpload } = useImageProcessor();

  const processFile = async (file: File) => {
    setIsAnalyzing(true);
    try {
      await handleFileUpload(
        file,
        onPhotoSelect,
        setImageDetails,
        onAnalysisComplete
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
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
    <div className="space-y-8">      
      <PhotoPreview selectedPhoto={selectedPhoto} imageDetails={imageDetails} />

      <UploadActions
        selectedPhoto={selectedPhoto}
        isAnalyzing={isAnalyzing}
        onFileSelect={() => document.getElementById('photo-input')?.click()}
        onAdvancedCrop={() => setShowAdvancedCrop(true)}
      />

      {/* Bulk Upload Option */}
      {onBulkUpload && (
        <div>
          <BulkUploadOption onSelectBulkUpload={onBulkUpload} />
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
