
import React from 'react';
import { PhotoUploadStep } from '@/components/editor/wizard/PhotoUploadStep';
import type { CreationMode } from '../../types';

interface PhotoStepProps {
  mode: CreationMode;
  selectedPhoto?: string;
  onPhotoSelect: (photo: string) => void;
}

export const PhotoStep = ({ mode, selectedPhoto, onPhotoSelect }: PhotoStepProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Upload Your Image</h2>
        <p className="text-crd-lightGray">
          {mode === 'quick' 
            ? 'Upload an image and we\'ll handle the rest with AI assistance'
            : 'Upload an image to get started with your card creation'
          }
        </p>
      </div>

      <div className="bg-crd-darker rounded-xl border border-crd-mediumGray/20 p-8">
        <PhotoUploadStep
          selectedPhoto={selectedPhoto}
          onPhotoSelect={onPhotoSelect}
          onAnalysisComplete={() => {}}
        />
      </div>

      {mode === 'quick' && (
        <div className="mt-6 text-center">
          <p className="text-crd-lightGray text-sm">
            💡 AI will automatically analyze your image and suggest card details
          </p>
        </div>
      )}
    </div>
  );
};
