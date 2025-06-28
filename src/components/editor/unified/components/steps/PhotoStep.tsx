
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Upload, Image, Frame } from 'lucide-react';
import { FramePreviewCanvas } from '@/components/editor/wizard/components/FramePreviewCanvas';
import { useWizardTemplates } from '@/components/editor/wizard/hooks/useWizardTemplates';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';
import type { DesignTemplate } from '@/types/card';

interface PhotoStepProps {
  mode: CreationMode;
  selectedPhoto?: string;
  onPhotoSelect: (photo: string) => void;
  cardData?: CardData;
  selectedFrame?: DesignTemplate;
  onFrameSelect?: (frame: DesignTemplate) => void;
}

// Default blank card template
const BLANK_CARD_TEMPLATE: DesignTemplate = {
  id: 'blank-card',
  name: 'No Frame',
  category: 'Basic',
  description: 'Clean blank card - perfect for complete card images',
  preview_url: '',
  template_data: {
    style: 'blank',
    aspectRatio: '2.5:3.5',
    layout: 'clean',
    colors: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      background: '#ffffff',
      text: '#000000'
    }
  },
  is_premium: false,
  usage_count: 0,
  tags: ['blank', 'clean', 'minimal']
};

export const PhotoStep = ({ 
  mode, 
  selectedPhoto, 
  onPhotoSelect, 
  cardData,
  selectedFrame,
  onFrameSelect 
}: PhotoStepProps) => {
  const { templates } = useWizardTemplates();
  const [currentFrame, setCurrentFrame] = useState<DesignTemplate>(
    selectedFrame || BLANK_CARD_TEMPLATE
  );

  // Add blank card as first option
  const allTemplates = [BLANK_CARD_TEMPLATE, ...templates];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onPhotoSelect(url);
    }
  };

  const handleFrameSelection = (template: DesignTemplate) => {
    setCurrentFrame(template);
    onFrameSelect?.(template);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Upload Photo & Choose Frame</h2>
        <p className="text-crd-lightGray">
          {mode === 'quick' 
            ? 'Upload your image and see it with different frame options'
            : 'Upload and customize your card image with frame preview'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Photo Upload */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Photo Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedPhoto ? (
              <div className="text-center">
                <div className="relative inline-block">
                  <img 
                    src={selectedPhoto} 
                    alt="Original upload"
                    className="max-w-full h-48 object-contain rounded-lg border border-crd-mediumGray/30"
                  />
                  <div className="absolute top-2 right-2 bg-crd-green text-black px-2 py-1 rounded-full text-xs font-medium">
                    Uploaded
                  </div>
                </div>
                <p className="mt-2 text-sm text-crd-lightGray">Original image</p>
                
                <CRDButton
                  onClick={() => document.getElementById('photo-input')?.click()}
                  variant="outline"
                  className="mt-4 border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
                >
                  Change Photo
                </CRDButton>
              </div>
            ) : (
              <div className="border-2 border-dashed border-crd-mediumGray/30 rounded-lg p-8 text-center">
                <Image className="w-12 h-12 mx-auto mb-4 text-crd-mediumGray" />
                <p className="text-crd-lightGray mb-4">No image selected</p>
                <CRDButton
                  onClick={() => document.getElementById('photo-input')?.click()}
                  variant="outline"
                  className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Photo
                </CRDButton>
              </div>
            )}
            
            <input
              id="photo-input"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Right Side - Frame Preview */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <Frame className="w-5 h-5" />
              Card Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FramePreviewCanvas
              imageUrl={selectedPhoto}
              selectedFrame={currentFrame}
              className="mb-6"
            />
            
            <div className="text-center">
              <h4 className="text-crd-white font-medium mb-2">
                Current Frame: {currentFrame.name}
              </h4>
              <p className="text-crd-lightGray text-sm">
                {currentFrame.description || 'Preview how your card will look'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Frame Selection */}
      <Card className="bg-crd-darker border-crd-mediumGray/20 mt-8">
        <CardHeader>
          <CardTitle className="text-crd-white">Choose Frame Style</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleFrameSelection(template)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  currentFrame.id === template.id
                    ? 'border-crd-green bg-crd-green/10'
                    : 'border-crd-mediumGray/30 hover:border-crd-green/50'
                }`}
              >
                <div className="aspect-[2.5/3.5] bg-crd-mediumGray/20 rounded mb-3 flex items-center justify-center">
                  {template.id === 'blank-card' ? (
                    <div className="w-full h-full bg-white rounded border border-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Clean</span>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-blue-500 to-purple-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{template.name}</span>
                    </div>
                  )}
                </div>
                
                <h4 className="text-crd-white font-medium text-sm mb-1">
                  {template.name}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-crd-lightGray text-xs">
                    {template.category}
                  </span>
                  {template.is_premium && (
                    <span className="text-crd-green text-xs font-medium">PRO</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
