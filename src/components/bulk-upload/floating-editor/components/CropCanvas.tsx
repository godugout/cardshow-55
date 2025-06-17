import React from 'react';
import { ImprovedCropOverlay } from '../../enhanced-crop/ImprovedCropOverlay';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface CropCanvasProps {
  imageLoaded: boolean;
  imagePosition: { x: number; y: number };
  imageDimensions: { width: number; height: number };
  imageUrl: string;
  zoom: number;
  cropArea: CropArea;
  canvasDimensions: { width: number; height: number };
  showGrid: boolean;
  aspectRatioMode: string;
  hasValidOverlap: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLElement>, handle: string) => void;
}

export const CropCanvas: React.FC<CropCanvasProps> = ({
  imageLoaded,
  imagePosition,
  imageDimensions,
  imageUrl,
  zoom,
  cropArea,
  canvasDimensions,
  showGrid,
  aspectRatioMode,
  hasValidOverlap,
  onMouseDown
}) => {
  return (
    <>
      {imageLoaded && (
        <>
          <img
            src={imageUrl}
            alt="Crop preview"
            className="absolute pointer-events-none"
            style={{
              left: imagePosition.x,
              top: imagePosition.y,
              width: imageDimensions.width,
              height: imageDimensions.height,
              transform: `scale(${zoom})`,
              transformOrigin: 'center'
            }}
          />
          
          {/* Canvas overlay for out-of-bounds visualization */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
          >
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <mask id="canvas-mask">
                  <rect width="100%" height="100%" fill="black" />
                  <rect 
                    x={cropArea.x} 
                    y={cropArea.y} 
                    width={cropArea.width} 
                    height={cropArea.height}
                    fill="white"
                    transform={`rotate(${cropArea.rotation} ${cropArea.x + cropArea.width/2} ${cropArea.y + cropArea.height/2})`}
                  />
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.3)" mask="url(#canvas-mask)" />
            </svg>
          </div>
          
          <ImprovedCropOverlay
            cropArea={cropArea}
            zoom={zoom}
            imageLoaded={imageLoaded}
            showGrid={showGrid}
            gridSize={20}
            aspectRatioLocked={aspectRatioMode !== 'free'}
            onMouseDown={onMouseDown}
            canvasWidth={canvasDimensions.width}
            canvasHeight={canvasDimensions.height}
          />

          {/* Visual indicator for invalid overlap */}
          {!hasValidOverlap && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium z-30">
              ⚠️ Crop area needs more overlap with image
            </div>
          )}

          {/* Dimension indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-lg text-xs font-medium z-30">
            {Math.round(cropArea.width)} × {Math.round(cropArea.height)} 
            {aspectRatioMode !== 'free' && (
              <span className="text-crd-green ml-2">
                {aspectRatioMode === 'card' ? '2.5:3.5' : 
                 aspectRatioMode === 'landscape' ? '3:2' :
                 aspectRatioMode === 'portrait' ? '2:3' : '1:1'}
              </span>
            )}
          </div>
        </>
      )}
      
      {!imageLoaded && (
        <div className="text-white">Loading image...</div>
      )}
    </>
  );
};
