
import React from 'react';
import { RotateCcw } from 'lucide-react';

interface CardFlipControlsProps {
  rotation: { x: number; y: number };
  onRotationChange: (rotation: { x: number; y: number }) => void;
  className?: string;
}

export const CardFlipControls: React.FC<CardFlipControlsProps> = ({
  rotation,
  onRotationChange,
  className = ""
}) => {
  const handleFlipToBack = () => {
    onRotationChange({ x: rotation.x, y: 180 });
  };

  const handleFlipToFront = () => {
    onRotationChange({ x: rotation.x, y: 0 });
  };

  const isShowingBack = ((rotation.y % 360) + 360) % 360 >= 90 && ((rotation.y % 360) + 360) % 360 <= 270;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={isShowingBack ? handleFlipToFront : handleFlipToBack}
        className="flex items-center space-x-1 px-3 py-1 bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 text-white text-sm transition-colors"
        title={isShowingBack ? "Show Front" : "Show Back"}
      >
        <RotateCcw className="w-4 h-4" />
        <span>{isShowingBack ? "Front" : "Back"}</span>
      </button>
      
      <div className="text-white/60 text-xs">
        Rotation: {rotation.y.toFixed(0)}°
      </div>
    </div>
  );
};
