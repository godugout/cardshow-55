import React, { useState, useCallback } from 'react';
import { CRDFrameEngine } from './CRDFrameEngine';
import { CRDFrameSelector } from './CRDFrameSelector';
import { CRDAdvancedCropper } from './CRDAdvancedCropper';
import type { CRDFrame, CropResult } from '@/types/crd-frame';
import { SAMPLE_CRD_FRAMES } from '@/data/sampleCRDFrames';

interface CRDFrameIntegrationProps {
  onCardComplete?: (cardData: any) => void;
  className?: string;
}

export const CRDFrameIntegration: React.FC<CRDFrameIntegrationProps> = ({
  onCardComplete,
  className = ''
}) => {
  const [selectedFrame, setSelectedFrame] = useState<CRDFrame | null>(null);
  const [frameContent, setFrameContent] = useState<Record<string, any>>({});
  const [selectedVisualStyle, setSelectedVisualStyle] = useState('classic_matte');

  // Handle frame selection
  const handleFrameSelect = useCallback((frame: CRDFrame) => {
    setSelectedFrame(frame);
    setFrameContent({}); // Reset content when switching frames
  }, []);

  // Handle content changes for regions
  const handleContentChange = useCallback((regionId: string, content: any) => {
    setFrameContent(prev => ({
      ...prev,
      [regionId]: content
    }));
  }, []);

  // Handle crop completion
  const handleCropComplete = useCallback((result: CropResult) => {
    // Update the content with the cropped image
    setFrameContent(prev => ({
      ...prev,
      [result.regionId]: {
        type: 'image',
        src: result.croppedImage,
        cropData: result.cropData,
        originalSrc: result.originalImage,
        backgroundRemoved: result.backgroundRemoved
      }
    }));
  }, []);

  // Initialize with first sample frame if none selected
  React.useEffect(() => {
    if (!selectedFrame && SAMPLE_CRD_FRAMES.length > 0) {
      setSelectedFrame(SAMPLE_CRD_FRAMES[0]);
    }
  }, [selectedFrame]);

  return (
    <div className={`w-full max-w-6xl mx-auto px-6 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Frame Browser - Left Side */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-crd-white">Select Your Frame</h3>
          <CRDFrameSelector
            selectedFrameId={selectedFrame?.id}
            onFrameSelect={handleFrameSelect}
            className="w-full"
          />
        </div>

        {/* Frame Preview - Right Side */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-crd-white">Preview</h3>
          {selectedFrame ? (
            <div className="flex justify-center">
              <CRDFrameEngine
                frame={selectedFrame}
                content={frameContent}
                selectedVisualStyle={selectedVisualStyle}
                onContentChange={handleContentChange}
                onCropComplete={handleCropComplete}
                className="max-w-md"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-crd-darker border border-crd-mediumGray/20 rounded-lg">
              <p className="text-crd-lightGray">Select a frame to see preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};