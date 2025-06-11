
import React from 'react';

interface InteractiveLightingLayerProps {
  isHovering: boolean;
  interactiveLighting: boolean;
  mousePosition: { x: number; y: number };
}

export const InteractiveLightingLayer: React.FC<InteractiveLightingLayerProps> = ({
  isHovering,
  interactiveLighting,
  mousePosition
}) => {
  if (!isHovering || !interactiveLighting) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-50"
      style={{
        background: `radial-gradient(
          ellipse 120% 80% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
          rgba(255, 255, 255, 0.06) 0%,
          rgba(255, 255, 255, 0.03) 40%,
          transparent 70%
        )`,
        mixBlendMode: 'soft-light',
        opacity: 0.5,
        transition: 'opacity 0.1s ease'
      }}
    />
  );
};
