
import React from 'react';

interface CropBorderProps {
  cropArea: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  };
  onMouseDown: (e: React.MouseEvent, handle: string) => void;
  children: React.ReactNode;
}

export const CropBorder: React.FC<CropBorderProps> = ({
  cropArea,
  onMouseDown,
  children
}) => {
  return (
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
      
      {children}
    </div>
  );
};
