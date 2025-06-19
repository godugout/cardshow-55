
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Edit, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { EnhancedCropDialog } from './EnhancedCropDialog';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface EnhancedPhotoEditSectionProps {
  selectedPhoto: string;
  selectedTemplate: DesignTemplate | null;
  imageFormat: 'square' | 'circle' | 'fullBleed';
  onPhotoSelect: (photo: string) => void;
  onPhotoRemove: () => void;
  onImageFormatChange: (format: 'square' | 'circle' | 'fullBleed') => void;
  isAnalyzing?: boolean;
}

export const EnhancedPhotoEditSection = ({
  selectedPhoto,
  selectedTemplate,
  imageFormat,
  onPhotoSelect,
  onPhotoRemove,
  onImageFormatChange,
  isAnalyzing = false
}: EnhancedPhotoEditSectionProps) => {
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
        toast.success('Photo uploaded! Click "Edit Photo" to crop and adjust.');
      }
    }
  });

  const handleCropComplete = (croppedImageUrl: string) => {
    onPhotoSelect(croppedImageUrl);
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
            <Upload className="w-12 h-12 mx-auto mb-4 text-crd-lightGray" />
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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Your Photo</h3>
              <p className="text-crd-lightGray text-sm">Ready for card creation</p>
            </div>
            <div className="flex items-center gap-2">
              {isAnalyzing && (
                <Badge className="bg-crd-blue/20 text-crd-blue">
                  AI Analyzing...
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('photo-input')?.click()}
                className="border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40"
              >
                <Camera className="w-4 h-4 mr-2" />
                Change
              </Button>
            </div>
          </div>

          {/* Photo Preview */}
          <div className="relative w-full aspect-[4/3] bg-crd-mediumGray/20 rounded-lg overflow-hidden">
            <img
              src={selectedPhoto}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            
            {/* Format indicator overlay */}
            <div className="absolute top-2 left-2">
              <Badge className="bg-crd-green/20 text-crd-green border-crd-green/30">
                {imageFormat === 'fullBleed' ? 'Full Card' : 
                 imageFormat === 'square' ? 'Square Crop' : 'Circle Crop'}
              </Badge>
            </div>
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
              onClick={onPhotoRemove}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Format Selection */}
          <div className="space-y-2">
            <h4 className="text-white font-medium text-sm">Quick Format</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fullBleed' as const, name: 'Full Card', icon: '🃏' },
                { id: 'square' as const, name: 'Square', icon: '⬜' },
                { id: 'circle' as const, name: 'Circle', icon: '⭕' }
              ].map((format) => (
                <Button
                  key={format.id}
                  onClick={() => onImageFormatChange(format.id)}
                  variant="outline"
                  size="sm"
                  className={`${
                    imageFormat === format.id
                      ? 'bg-crd-green/20 border-crd-green text-crd-green'
                      : 'border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40'
                  }`}
                >
                  <span className="mr-2">{format.icon}</span>
                  {format.name}
                </Button>
              ))}
            </div>
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
        initialFormat={imageFormat === 'fullBleed' ? 'fullCard' : 'cropped'}
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
