
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { InlineCropPreview } from './InlineCropPreview';
import type { DesignTemplate } from '@/hooks/useCardEditor';
import type { CropBounds } from '@/services/imageCropper';

interface CleanPhotoSectionProps {
  selectedPhoto: string;
  selectedTemplate: DesignTemplate | null;
  onPhotoSelect: (photo: string) => void;
  onPhotoRemove: () => void;
  isAnalyzing?: boolean;
}

export const CleanPhotoSection = ({
  selectedPhoto,
  selectedTemplate,
  onPhotoSelect,
  onPhotoRemove,
  isAnalyzing = false
}: CleanPhotoSectionProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        onPhotoSelect(imageUrl);
        toast.success('Photo uploaded!');
      }
    }
  });

  const handleCropChange = (bounds: CropBounds) => {
    // Store crop bounds for later use
    console.log('Crop bounds updated:', bounds);
  };

  if (!selectedPhoto) {
    return (
      <Card className="bg-crd-darkGray border-crd-mediumGray/30">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-crd-green bg-crd-green/10'
                : 'border-crd-mediumGray hover:border-crd-green/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-3 text-crd-lightGray" />
            <h3 className="text-white text-lg font-medium mb-2">
              {isDragActive ? 'Drop your photo here' : 'Upload Your Photo'}
            </h3>
            <p className="text-crd-lightGray mb-4">
              Drag and drop your image here, or click to browse
            </p>
            <Button className="bg-crd-green hover:bg-crd-green/90 text-black font-semibold">
              <Camera className="w-4 h-4 mr-2" />
              Choose Photo
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-crd-darkGray border-crd-mediumGray/30">
        <CardContent className="p-6 space-y-4">
          {/* Inline Crop Preview */}
          <InlineCropPreview
            selectedPhoto={selectedPhoto}
            onCropChange={handleCropChange}
            aspectRatio={2.5 / 3.5}
          />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => document.getElementById('photo-input')?.click()}
              className="bg-crd-blue hover:bg-crd-blue/90 text-white flex-1"
            >
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        id="photo-input"
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const imageUrl = URL.createObjectURL(file);
            onPhotoSelect(imageUrl);
          }
          e.target.value = '';
        }}
        className="hidden"
      />
    </>
  );
};
