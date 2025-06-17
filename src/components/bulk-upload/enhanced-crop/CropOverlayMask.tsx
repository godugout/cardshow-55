
import React from 'react';

interface CropOverlayMaskProps {
  cropArea: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  };
  zoom: number;
}

export const CropOverlayMask: React.FC<CropOverlayMaskProps> = ({
  cropArea,
  zoom
}) => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none" 
      style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
    >
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
    </div>
  );
};
