
import React, { useRef, useEffect, useCallback } from 'react';
import { InteractiveCropArea } from '../InteractiveCropArea';
import type { CropBounds } from '@/services/imageCropper';

interface CropCanvasProps {
  selectedPhoto: string;
  cropBounds: CropBounds;
  cropFormat: 'fullCard' | 'cropped';
  imageDimensions: { width: number; height: number };
  imagePosition: { x: number; y: number };
  zoom: number;
  showGrid: boolean;
  imageLoading: boolean;
  imageError: boolean;
  setCropBounds: (bounds: CropBounds) => void;
  onZoomChange: (zoom: number) => void;
}

export const CropCanvas = ({
  selectedPhoto,
  cropBounds,
  cropFormat,
  imageDimensions,
  imagePosition,
  zoom,
  showGrid,
  imageLoading,
  imageError,
  setCropBounds,
  onZoomChange
}: CropCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle zoom with mouse wheel
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    onZoomChange(Math.max(0.5, Math.min(3, zoom + delta)));
  }, [zoom, onZoomChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-800 p-2 overflow-hidden relative"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {imageLoading && (
          <div className="text-white text-center">
            <div className="animate-pulse">Loading image...</div>
          </div>
        )}
        
        {imageError && (
          <div className="text-red-400 text-center">
            <div>Failed to load image</div>
            <div className="text-sm mt-2">Please try uploading a different image</div>
          </div>
        )}
        
        {!imageLoading && !imageError && imageDimensions.width > 0 && (
          <>
            {/* Background Image with Darkening */}
            <img
              src={selectedPhoto}
              alt="Crop preview background"
              className="absolute"
              style={{
                width: imageDimensions.width * zoom,
                height: imageDimensions.height * zoom,
                left: imagePosition.x,
                top: imagePosition.y,
                filter: 'brightness(0.3)' // Darken the background image
              }}
            />

            {/* Bright crop area */}
            <div
              className="absolute overflow-hidden"
              style={{
                left: imagePosition.x + (cropBounds.x / 100) * imageDimensions.width * zoom,
                top: imagePosition.y + (cropBounds.y / 100) * imageDimensions.height * zoom,
                width: (cropBounds.width / 100) * imageDimensions.width * zoom,
                height: (cropBounds.height / 100) * imageDimensions.height * zoom,
                borderRadius: cropFormat === 'cropped' ? '8px' : '4px'
              }}
            >
              <img
                src={selectedPhoto}
                alt="Crop area"
                className="absolute"
                style={{
                  width: imageDimensions.width * zoom,
                  height: imageDimensions.height * zoom,
                  left: -(cropBounds.x / 100) * imageDimensions.width * zoom,
                  top: -(cropBounds.y / 100) * imageDimensions.height * zoom,
                  filter: 'brightness(1) contrast(1.1)' // Bright and enhanced
                }}
              />
            </div>

            {/* Interactive Crop Area Component */}
            <InteractiveCropArea
              cropBounds={cropBounds}
              setCropBounds={setCropBounds}
              imageDimensions={imageDimensions}
              imagePosition={imagePosition}
              zoom={zoom}
              aspectRatio={cropFormat === 'fullCard' ? 2.5 / 3.5 : 1}
              showGrid={showGrid}
            />
          </>
        )}
      </div>
      
      {/* Scroll to zoom hint */}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
        Scroll to zoom • Drag crop area to move
      </div>
    </div>
  );
};
