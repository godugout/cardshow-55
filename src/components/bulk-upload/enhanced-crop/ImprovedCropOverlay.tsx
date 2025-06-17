
import React from 'react';
import { CropHandle } from './CropHandle';
import { CropBorder } from './CropBorder';
import { CropGrid } from './CropGrid';
import { CropOverlayMask } from './CropOverlayMask';
import { AspectRatioIndicator } from './AspectRatioIndicator';

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

  return (
    <div 
      className="absolute inset-0 pointer-events-none" 
      style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
    >
      {/* Grid Overlay */}
      <CropGrid 
        showGrid={showGrid}
        gridSize={gridSize}
        cropArea={cropArea}
        zoom={1} // Already scaled by parent
      />

      {/* Dark Overlay with Crop Cutout */}
      <CropOverlayMask 
        cropArea={cropArea}
        zoom={1} // Already scaled by parent
      />

      {/* Crop Area Border and Handles */}
      <CropBorder cropArea={cropArea} onMouseDown={onMouseDown}>
        {/* Corner Handles */}
        {[
          { pos: 'tl', style: { top: -handleSize/2, left: -handleSize/2, cursor: 'nw-resize' } },
          { pos: 'tr', style: { top: -handleSize/2, right: -handleSize/2, cursor: 'ne-resize' } },
          { pos: 'bl', style: { bottom: -handleSize/2, left: -handleSize/2, cursor: 'sw-resize' } },
          { pos: 'br', style: { bottom: -handleSize/2, right: -handleSize/2, cursor: 'se-resize' } }
        ].map(({ pos, style }) => (
          <CropHandle
            key={pos}
            type="corner"
            position={pos}
            size={handleSize}
            color="#45B26B"
            style={style}
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
          <CropHandle
            key={pos}
            type="edge"
            position={pos}
            size={handleSize}
            color="#3B82F6"
            style={style}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMouseDown(e, pos);
            }}
          />
        ))}

        {/* Rotation Handle */}
        <CropHandle
          type="rotation"
          position="rotation"
          size={handleSize}
          color="#45B26B"
          style={{
            top: -rotationHandleDistance,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onMouseDown(e, 'rotate');
          }}
        />

        {/* Center Move Handle */}
        <CropHandle
          type="center"
          position="center"
          size={handleSize}
          color="#45B26B"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onMouseDown(e, 'move');
          }}
        />
      </CropBorder>

      {/* Aspect Ratio Lock Indicator */}
      <AspectRatioIndicator 
        aspectRatioLocked={aspectRatioLocked}
        cropArea={cropArea}
      />
    </div>
  );
};
