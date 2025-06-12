
import React from 'react';

interface GripFeedbackProps {
  gripPoint: { x: number; y: number } | null;
  isGripping: boolean;
  containerWidth: number;
  containerHeight: number;
}

export const GripFeedback: React.FC<GripFeedbackProps> = ({
  gripPoint,
  isGripping,
  containerWidth,
  containerHeight
}) => {
  if (!gripPoint || !isGripping) return null;

  const style = {
    position: 'absolute' as const,
    left: `${gripPoint.x * containerWidth}px`,
    top: `${gripPoint.y * containerHeight}px`,
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none' as const,
    zIndex: 1000
  };

  return (
    <div style={style}>
      {/* Outer grip ring */}
      <div className="absolute inset-0 w-8 h-8 border-2 border-crd-primary rounded-full opacity-60 animate-pulse" />
      
      {/* Inner grip point */}
      <div className="absolute inset-0 w-3 h-3 bg-crd-primary rounded-full opacity-80 transform translate-x-2.5 translate-y-2.5" />
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 w-12 h-12 bg-crd-primary rounded-full opacity-20 blur-sm transform -translate-x-1.5 -translate-y-1.5" />
    </div>
  );
};
