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
    <div className={`space-y-6 ${className}`}>
      {/* Frame Selector */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Select CRD Frame</h3>
        <CRDFrameSelector
          selectedFrameId={selectedFrame?.id}
          onFrameSelect={handleFrameSelect}
        />
      </div>

      {/* Frame Engine */}
      {selectedFrame && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Design Your Card</h3>
            
            {/* Visual Style Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Style:</label>
              <select
                value={selectedVisualStyle}
                onChange={(e) => setSelectedVisualStyle(e.target.value)}
                className="text-sm border border-border rounded px-2 py-1 bg-background"
              >
                <option value="classic_matte">Classic Matte</option>
                <option value="premium_gloss">Premium Gloss</option>
                <option value="holographic">Holographic</option>
                <option value="foil_chrome">Foil Chrome</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <CRDFrameEngine
              frame={selectedFrame}
              content={frameContent}
              selectedVisualStyle={selectedVisualStyle}
              onContentChange={handleContentChange}
              onCropComplete={handleCropComplete}
            />
          </div>

          {/* Content Summary */}
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Frame Content</h4>
            <div className="text-sm space-y-1">
              {selectedFrame.frame_config.regions.map(region => (
                <div key={region.id} className="flex items-center justify-between">
                  <span>{region.name}:</span>
                  <span className={frameContent[region.id] ? 'text-green-600' : 'text-muted-foreground'}>
                    {frameContent[region.id] ? '✓ Added' : 'Empty'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};