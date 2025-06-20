
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoUploadZoneProps {
  selectedPhoto: string;
  onPhotoUpload: (photoData: string) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export const PhotoUploadZone = ({ 
  selectedPhoto, 
  onPhotoUpload, 
  isAnalyzing, 
  setIsAnalyzing 
}: PhotoUploadZoneProps) => {
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setIsAnalyzing(true);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onPhotoUpload(result);
      
      // Simulate AI analysis
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 2000);
    };
    reader.readAsDataURL(file);
  }, [onPhotoUpload, setIsAnalyzing]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPhotoUpload('');
  };

  if (selectedPhoto) {
    return (
      <div className="relative">
        <div className="relative bg-crd-darker rounded-lg overflow-hidden">
          <img
            src={selectedPhoto}
            alt="Selected photo"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRemovePhoto}
                className="bg-white/20 backdrop-blur hover:bg-white/30"
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
              <Button
                variant="secondary"
                size="sm"
                {...getRootProps()}
                className="bg-white/20 backdrop-blur hover:bg-white/30"
              >
                <Upload className="w-4 h-4 mr-2" />
                Replace
              </Button>
            </div>
          </div>
          <input {...getInputProps()} />
        </div>
        
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
            <div className="text-center text-white">
              <div className="animate-spin w-8 h-8 border-2 border-crd-green border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm">Analyzing image...</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-crd-green bg-crd-green/10'
          : 'border-crd-mediumGray hover:border-crd-lightGray'
      }`}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-crd-mediumGray/30 rounded-full flex items-center justify-center">
          <Upload className="w-8 h-8 text-crd-lightGray" />
        </div>
        
        <div className="space-y-2">
          <h4 className="text-lg font-medium text-white">
            {isDragActive ? 'Drop your photo here' : 'Upload your photo'}
          </h4>
          <p className="text-sm text-crd-lightGray">
            Drag and drop an image file, or click to browse
          </p>
          <p className="text-xs text-crd-mediumGray">
            Supports JPG, PNG, WebP up to 10MB
          </p>
        </div>
        
        <Button
          type="button"
          className="bg-crd-green hover:bg-crd-green/90 text-black font-medium"
        >
          <Image className="w-4 h-4 mr-2" />
          Choose File
        </Button>
      </div>
    </div>
  );
};
