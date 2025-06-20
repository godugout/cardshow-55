
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Image, Crop, Sparkles } from 'lucide-react';
import { PhotoUploadZone } from '../components/PhotoUploadZone';
import { StylePresetGrid } from '../components/StylePresetGrid';
import { LiveCardPreview } from '../components/LiveCardPreview';

interface UploadAndStyleStepProps {
  mode: 'quick' | 'template' | 'canvas' | 'professional';
  onComplete: (data: any) => void;
  onCropRequest: (imageData: string) => void;
  initialData: any;
}

export const UploadAndStyleStep = ({ 
  mode, 
  onComplete, 
  onCropRequest, 
  initialData 
}: UploadAndStyleStepProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string>(initialData.selectedPhoto || '');
  const [selectedStyle, setSelectedStyle] = useState<string>(initialData.selectedStyle || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handlePhotoUpload = (photoData: string) => {
    setSelectedPhoto(photoData);
  };

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const handleCropPhoto = () => {
    if (selectedPhoto) {
      onCropRequest(selectedPhoto);
    }
  };

  const handleContinue = () => {
    onComplete({
      selectedPhoto,
      selectedStyle,
      cardData: {
        title: 'My New Card',
        image_url: selectedPhoto,
        style: selectedStyle
      }
    });
  };

  const canContinue = selectedPhoto && (mode === 'quick' ? selectedStyle : true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
        
        {/* Left Panel - Upload & Style */}
        <div className="lg:col-span-2 space-y-6 overflow-y-auto">
          {/* Photo Upload Section */}
          <Card className="bg-crd-darkGray border-crd-mediumGray/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Image className="w-5 h-5 mr-2 text-crd-green" />
                Upload Photo
              </h3>
              {selectedPhoto && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCropPhoto}
                  className="border-crd-lightGray text-crd-lightGray hover:bg-crd-lightGray hover:text-black"
                >
                  <Crop className="w-4 h-4 mr-2" />
                  Crop
                </Button>
              )}
            </div>
            
            <PhotoUploadZone
              selectedPhoto={selectedPhoto}
              onPhotoUpload={handlePhotoUpload}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
            />
          </Card>

          {/* Style Presets Section - Only show for quick mode */}
          {mode === 'quick' && (
            <Card className="bg-crd-darkGray border-crd-mediumGray/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-crd-green" />
                Choose Style
              </h3>
              
              <StylePresetGrid
                selectedStyle={selectedStyle}
                onStyleSelect={handleStyleSelect}
                previewImage={selectedPhoto}
              />
            </Card>
          )}

          {/* AI Analysis Results */}
          {isAnalyzing && (
            <Card className="bg-crd-darkGray border-crd-mediumGray/30 p-6">
              <div className="flex items-center text-crd-green">
                <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                <span>AI is analyzing your image...</span>
              </div>
            </Card>
          )}
        </div>

        {/* Right Panel - Live Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="bg-crd-darkGray border-crd-mediumGray/30 p-6 h-[calc(100vh-300px)]">
              <h3 className="text-lg font-semibold text-white mb-4">Live Preview</h3>
              
              <LiveCardPreview
                photo={selectedPhoto}
                style={selectedStyle}
                mode={mode}
              />
              
              {/* Continue Button */}
              <div className="mt-6">
                <Button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
                >
                  {mode === 'quick' ? 'Create Card' : 'Continue'}
                </Button>
                
                {!canContinue && (
                  <p className="text-sm text-crd-lightGray mt-2 text-center">
                    {!selectedPhoto ? 'Upload a photo to continue' : 'Select a style to continue'}
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
