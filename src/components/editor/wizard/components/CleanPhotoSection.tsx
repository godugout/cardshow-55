
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Edit, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { EnhancedCropDialog } from './EnhancedCropDialog';
import type { DesignTemplate } from '@/hooks/useCardEditor';

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
        toast.success('Photo uploaded successfully!');
      }
    }
  });

  const handleCropComplete = (croppedImageUrl: string) => {
    onPhotoSelect(croppedImageUrl);
  };

  if (!selectedPhoto) {
    return (
      <Card className="bg-crd-darkGray border-crd-mediumGray/30">
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-crd-green bg-crd-green/10'
                : 'border-crd-mediumGray hover:border-crd-green/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-16 h-16 mx-auto mb-4 text-crd-lightGray" />
            <h3 className="text-white text-xl font-medium mb-2">
              {isDragActive ? 'Drop your photo here' : 'Upload Your Photo'}
            </h3>
            <p className="text-crd-lightGray mb-6">
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
          {/* Header with Status */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Your Photo</h3>
              <p className="text-crd-lightGray text-sm">Ready for card creation</p>
            </div>
            {isAnalyzing && (
              <Badge className="bg-crd-blue/20 text-crd-blue border-crd-blue/30">
                AI Analyzing...
              </Badge>
            )}
          </div>

          {/* Photo Preview */}
          <div className="relative w-full aspect-[4/3] bg-crd-mediumGray/20 rounded-lg overflow-hidden">
            <img
              src={selectedPhoto}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => setShowCropDialog(true)}
              className="bg-crd-blue hover:bg-crd-blue/90 text-white flex-1"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Photo
            </Button>
            
            <Button
              onClick={() => document.getElementById('photo-input')?.click()}
              variant="outline"
              className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              Change
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Crop Dialog */}
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
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            setOriginalFile(file);
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
