
import React, { useCallback } from 'react';
import { Upload, Camera, FileImage, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface PhotoUploadStepProps {
  selectedPhoto: string | null;
  onPhotoSelect: (photoUrl: string) => void;
  selectedTemplate: DesignTemplate | null;
}

export const PhotoUploadStep = ({ selectedPhoto, onPhotoSelect, selectedTemplate }: PhotoUploadStepProps) => {
  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('Image size should be less than 10MB');
      return;
    }

    try {
      // Create a URL for the uploaded file
      const imageUrl = URL.createObjectURL(file);
      onPhotoSelect(imageUrl);
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo. Please try again.');
    }
  }, [onPhotoSelect]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const getTemplateRecommendation = () => {
    if (!selectedTemplate) return null;
    
    const recommendations = {
      'baseball-classic': 'Upload a clear action shot or portrait of the player in uniform',
      'basketball-modern': 'Best with dynamic action shots showing the player in motion',
      'football-pro': 'Professional headshot or game action photo works best',
      'soccer-international': 'Action shots during gameplay or celebration moments',
      'musician-spotlight': 'Stage performance or professional artist photos',
      'actor-premiere': 'Professional headshots or red carpet photos work great'
    };
    
    return recommendations[selectedTemplate.id as keyof typeof recommendations] || 
           'Upload a high-quality photo that represents your subject well';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Upload Your Photo</h2>
        <p className="text-crd-lightGray">
          Add the main photo for your card - this will be the centerpiece of your design
        </p>
      </div>

      {selectedTemplate && (
        <div className="p-4 bg-crd-blue/10 rounded-lg border border-crd-blue/30">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-crd-blue mt-0.5" />
            <div>
              <p className="text-white font-medium mb-1">Photo Tip for {selectedTemplate.name}</p>
              <p className="text-crd-lightGray text-sm">
                {getTemplateRecommendation()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-crd-mediumGray rounded-xl p-8 text-center hover:border-crd-green transition-colors cursor-pointer bg-crd-mediumGray/10"
      >
        {selectedPhoto ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={selectedPhoto}
                alt="Uploaded photo"
                className="max-w-full max-h-64 rounded-lg shadow-lg"
              />
              <div className="absolute top-2 right-2 bg-crd-green text-black px-2 py-1 rounded-md text-xs font-medium">
                ✓ Uploaded
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-white font-medium">Photo uploaded successfully!</p>
              <Button
                variant="outline"
                onClick={() => document.getElementById('photo-upload')?.click()}
                className="bg-transparent border-crd-green text-crd-green hover:bg-crd-green hover:text-black"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Different Photo
              </Button>
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
              <p className="text-white font-medium">Drop your photo here, or click to browse</p>
              <p className="text-crd-lightGray text-sm">
                Supports JPG, PNG, WebP • Max 10MB • Recommended: 1080x1080 or higher
              </p>
            </div>
            <Button
              onClick={() => document.getElementById('photo-upload')?.click()}
              className="bg-crd-green hover:bg-crd-green/90 text-black font-medium"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Photo
            </Button>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Additional Upload Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-crd-mediumGray/20 rounded-lg border border-crd-mediumGray/50">
          <div className="flex items-center gap-3 mb-2">
            <Camera className="w-5 h-5 text-crd-green" />
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
            Browse our collection of stock sports photos
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
    </div>
  );
};
