
import React from 'react';
import { RotateCw, Move } from 'lucide-react';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface ImprovedCropOverlayProps {
  cropArea: CropArea;
  zoom: number;
  imageLoaded: boolean;
  showGrid: boolean;
  gridSize: number;
  aspectRatioLocked: boolean;
  onMouseDown: (e: React.MouseEvent, handle: string) => void;
  canvasWidth: number;
  canvasHeight: number;
}

export const ImprovedCropOverlay: React.FC<ImprovedCropOverlayProps> = ({
  cropArea,
  zoom,
  imageLoaded,
  showGrid,
  gridSize,
  aspectRatioLocked,
  onMouseDown,
  canvasWidth,
  canvasHeight
}) => {
  if (!imageLoaded) return null;

  const handleSize = 12;
  const rotationHandleDistance = 30;

  const isInsideCrop = (x: number, y: number) => {
    return x >= cropArea.x && x <= cropArea.x + cropArea.width &&
           y >= cropArea.y && y <= cropArea.y + cropArea.height;
  };

  return (
    <div 
      className="absolute inset-0 pointer-events-none" 
      style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
    >
      {/* Grid Overlay - only outside crop area */}
      {showGrid && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <pattern id="crop-grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
              <path 
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} 
                fill="none" 
                stroke="rgba(69, 178, 107, 0.3)" 
                strokeWidth="0.5"
              />
            </pattern>
            <mask id="crop-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect 
                x={cropArea.x} 
                y={cropArea.y} 
                width={cropArea.width} 
                height={cropArea.height}
                fill="black"
                transform={`rotate(${cropArea.rotation} ${cropArea.x + cropArea.width/2} ${cropArea.y + cropArea.height/2})`}
              />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#crop-grid)" mask="url(#crop-mask)" />
        </svg>
      )}

      {/* Dark Overlay with Crop Cutout */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <mask id="overlay-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect 
              x={cropArea.x} 
              y={cropArea.y} 
              width={cropArea.width} 
              height={cropArea.height}
              fill="black"
              transform={`rotate(${cropArea.rotation} ${cropArea.x + cropArea.width/2} ${cropArea.y + cropArea.height/2})`}
            />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.3)" mask="url(#overlay-mask)" />
      </svg>

      {/* Crop Area Border and Handles */}
      <div
        className="absolute pointer-events-auto"
        style={{
          left: cropArea.x,
          top: cropArea.y,
          width: cropArea.width,
          height: cropArea.height,
          transform: `rotate(${cropArea.rotation}deg)`,
          transformOrigin: 'center',
        }}
      >
        {/* Main Border */}
        <div 
          className="absolute inset-0 border-2 border-crd-green shadow-lg cursor-move"
          style={{
            boxShadow: '0 0 0 1px rgba(69, 178, 107, 0.3), inset 0 0 0 1px rgba(69, 178, 107, 0.2)'
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            onMouseDown(e, 'move');
          }}
        />

        {/* Corner Handles */}
        {[
          { pos: 'tl', style: { top: -handleSize/2, left: -handleSize/2, cursor: 'nw-resize' } },
          { pos: 'tr', style: { top: -handleSize/2, right: -handleSize/2, cursor: 'ne-resize' } },
          { pos: 'bl', style: { bottom: -handleSize/2, left: -handleSize/2, cursor: 'sw-resize' } },
          { pos: 'br', style: { bottom: -handleSize/2, right: -handleSize/2, cursor: 'se-resize' } }
        ].map(({ pos, style }) => (
          <div
            key={pos}
            className="absolute bg-crd-green border-2 border-white rounded-sm shadow-md hover:bg-crd-green/80 hover:scale-110 transition-all"
            style={{
              width: handleSize,
              height: handleSize,
              ...style
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMouseDown(e, pos);
            }}
          />
        ))}

        {/* Edge Handles */}
        {[
          { pos: 't', style: { top: -handleSize/2, left: '50%', transform: 'translateX(-50%)', cursor: 'n-resize' } },
          { pos: 'r', style: { right: -handleSize/2, top: '50%', transform: 'translateY(-50%)', cursor: 'e-resize' } },
          { pos: 'b', style: { bottom: -handleSize/2, left: '50%', transform: 'translateX(-50%)', cursor: 's-resize' } },
          { pos: 'l', style: { left: -handleSize/2, top: '50%', transform: 'translateY(-50%)', cursor: 'w-resize' } }
        ].map(({ pos, style }) => (
          <div
            key={pos}
            className="absolute bg-crd-blue border border-white rounded-sm shadow-sm hover:bg-crd-blue/80 hover:scale-110 transition-all"
            style={{
              width: handleSize - 2,
              height: handleSize - 2,
              ...style
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMouseDown(e, pos);
            }}
          />
        ))}

        {/* Rotation Handle */}
        <div
          className="absolute bg-gradient-to-r from-crd-blue to-crd-green border-2 border-white rounded-full shadow-lg hover:scale-110 transition-all flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{
            width: handleSize + 4,
            height: handleSize + 4,
            top: -rotationHandleDistance,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onMouseDown(e, 'rotate');
          }}
        >
          <RotateCw className="w-3 h-3 text-white" />
        </div>

        {/* Center Move Handle */}
        <div
          className="absolute bg-crd-green/90 border border-white rounded-md shadow-md hover:bg-crd-green hover:scale-110 transition-all flex items-center justify-center cursor-move"
          style={{
            width: handleSize + 2,
            height: handleSize + 2,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onMouseDown(e, 'move');
          }}
        >
          <Move className="w-3 h-3 text-white" />
        </div>

        {/* Aspect Ratio Lock Indicator */}
        {aspectRatioLocked && (
          <div className="absolute -top-8 -right-2 bg-crd-green text-white text-xs px-2 py-1 rounded-md shadow-md">
            🔒 2.5:3.5
          </div>
        )}
      </div>
    </div>
  );
};
