
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, Crop, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { InlineCropPreview } from './InlineCropPreview';
import { EnhancedCropDialog } from './EnhancedCropDialog';
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
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setOriginalFile(file);
        const imageUrl = URL.createObjectURL(file);
        onPhotoSelect(imageUrl);
        toast.success('Photo uploaded!');
      }
    }
  });

  const handleCropChange = (bounds: CropBounds) => {
    console.log('Crop bounds updated:', bounds);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFile(file);
      const imageUrl = URL.createObjectURL(file);
      onPhotoSelect(imageUrl);
    }
    e.target.value = '';
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    onPhotoSelect(croppedImageUrl);
    setShowCropDialog(false);
    toast.success('Crop applied successfully!');
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
            <Button
              onClick={() => setShowCropDialog(true)}
              className="bg-crd-green hover:bg-crd-green/90 text-black"
            >
              <Crop className="w-4 h-4 mr-2" />
              Advanced Crop
            </Button>
            <Button
              onClick={onPhotoRemove}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Crop Dialog */}
      <EnhancedCropDialog
        isOpen={showCropDialog}
        onClose={() => setShowCropDialog(false)}
        selectedPhoto={selectedPhoto}
        originalFile={originalFile}
        onCropComplete={handleCropComplete}
        initialFormat="fullCard"
      />

      {/* Hidden file input */}
      <input
        id="photo-input"
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </>
  );
}
