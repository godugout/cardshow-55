
import React from 'react';

interface CropGridProps {
  showGrid: boolean;
  gridSize: number;
  cropArea: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  };
  zoom: number;
}

export const CropGrid: React.FC<CropGridProps> = ({
  showGrid,
  gridSize,
  cropArea,
  zoom
}) => {
  if (!showGrid) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none" 
      style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
    >
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
    </div>
  );
};
