
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
          rgba(255, 255, 255, 0.12) 0%,
          rgba(255, 255, 255, 0.08) 40%,
          rgba(255, 255, 255, 0.04) 70%,
          transparent 85%
        )`,
        mixBlendMode: 'soft-light',
        opacity: 0.8,
        transition: 'opacity 0.1s ease'
      }}
    />
  );
};
