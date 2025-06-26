
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Upload, Image } from 'lucide-react';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface PhotoStepProps {
  mode: CreationMode;
  selectedPhoto?: string;
  onPhotoSelect: (photo: string) => void;
  cardData?: CardData;
}

export const PhotoStep = ({ mode, selectedPhoto, onPhotoSelect, cardData }: PhotoStepProps) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onPhotoSelect(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Upload Your Photo</h2>
        <p className="text-crd-lightGray">
          {mode === 'quick' 
            ? 'Choose an image for your card'
            : 'Upload and customize your card image'
          }
        </p>
      </div>

      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader>
          <CardTitle className="text-crd-white">Photo Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedPhoto ? (
            <div className="text-center">
              <img 
                src={selectedPhoto} 
                alt="Selected"
                className="max-w-sm mx-auto rounded-lg border border-crd-mediumGray/30"
              />
              <p className="mt-2 text-sm text-crd-lightGray">Photo selected</p>
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
    </div>
  );
};
