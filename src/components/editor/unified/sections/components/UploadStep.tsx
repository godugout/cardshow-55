
import React from 'react';
import { PhotoDropzone } from './PhotoDropzone';
import { PhotoPreview } from './PhotoPreview';
import { UploadProgress } from './UploadProgress';

interface UploadStepProps {
  isProcessing: boolean;
  isAnalyzing: boolean;
  uploadProgress: number;
  imageUrl?: string;
  onFileSelect: (file: File) => void;
}

export const UploadStep: React.FC<UploadStepProps> = ({
  isProcessing,
  isAnalyzing,
  uploadProgress,
  imageUrl,
  onFileSelect
}) => {
  if (isProcessing || isAnalyzing) {
    return (
      <div className="border-2 border-dashed border-crd-green/50 rounded-xl p-6 text-center min-h-[280px] flex flex-col items-center justify-center">
        <UploadProgress progress={uploadProgress} />
        {isAnalyzing && (
          <p className="text-crd-lightGray mt-4">Running smart media analysis...</p>
        )}
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="border-2 border-dashed border-crd-green rounded-xl p-6 text-center bg-crd-green/5 min-h-[280px] flex flex-col items-center justify-center">
        <PhotoPreview 
          imageUrl={imageUrl}
          onReplace={() => onFileSelect}
        />
      </div>
    );
  }

  return (
    <PhotoDropzone 
      onFileSelect={onFileSelect}
      disabled={isProcessing || isAnalyzing}
    />
  );
};
