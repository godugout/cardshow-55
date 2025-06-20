
import React, { useRef, useEffect, useCallback } from 'react';
import { InteractiveCropArea } from '../InteractiveCropArea';
import type { CropBounds } from '@/services/imageCropper';

interface ProfessionalCropCanvasProps {
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

export const ProfessionalCropCanvas = ({
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
}: ProfessionalCropCanvasProps) => {
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
      className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 overflow-hidden relative"
    >
      <div className="relative w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
        {imageLoading && (
          <div className="flex items-center justify-center text-white">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gray-700 rounded-lg mb-4"></div>
              <div className="text-center">Loading image...</div>
            </div>
          </div>
        )}
        
        {imageError && (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-red-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">⚠</span>
            </div>
            <div className="text-red-400 font-medium">Failed to load image</div>
            <div className="text-gray-400 text-sm mt-2">Please try uploading a different image</div>
          </div>
        )}
        
        {!imageLoading && !imageError && imageDimensions.width > 0 && (
          <>
            {/* Background Image with Darkening */}
            <img
              src={selectedPhoto}
              alt="Crop preview background"
              className="absolute rounded-lg"
              style={{
                width: imageDimensions.width * zoom,
                height: imageDimensions.height * zoom,
                left: imagePosition.x,
                top: imagePosition.y,
                filter: 'brightness(0.4) contrast(0.8)',
                transition: 'all 0.2s ease-out'
              }}
            />

            {/* Bright crop area */}
            <div
              className="absolute overflow-hidden shadow-2xl"
              style={{
                left: imagePosition.x + (cropBounds.x / 100) * imageDimensions.width * zoom,
                top: imagePosition.y + (cropBounds.y / 100) * imageDimensions.height * zoom,
                width: (cropBounds.width / 100) * imageDimensions.width * zoom,
                height: (cropBounds.height / 100) * imageDimensions.height * zoom,
                borderRadius: cropFormat === 'cropped' ? '12px' : '6px',
                transition: 'all 0.2s ease-out'
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
                  filter: 'brightness(1) contrast(1.05) saturate(1.1)'
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
      
      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg border border-gray-600">
        <div className="flex items-center gap-4">
          <span>🖱️ Scroll to zoom</span>
          <span>⌨️ G for grid</span>
          <span>↕️ Drag to move</span>
        </div>
      </div>
    </div>
  );
};
