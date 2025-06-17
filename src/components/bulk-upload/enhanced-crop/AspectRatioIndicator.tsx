
import React from 'react';

interface AspectRatioIndicatorProps {
  aspectRatioLocked: boolean;
  cropArea: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  };
}

export const AspectRatioIndicator: React.FC<AspectRatioIndicatorProps> = ({
  aspectRatioLocked,
  cropArea
}) => {
  if (!aspectRatioLocked) return null;

  return (
    <div 
      className="absolute -top-8 -right-2 bg-crd-green text-white text-xs px-2 py-1 rounded-md shadow-md"
      style={{
        left: cropArea.x + cropArea.width,
        top: cropArea.y - 32,
        transform: `rotate(${cropArea.rotation}deg)`,
        transformOrigin: 'bottom left',
      }}
    >
      🔒 2.5:3.5
    </div>
  );
};
