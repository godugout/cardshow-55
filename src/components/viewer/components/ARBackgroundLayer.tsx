
import React from 'react';

interface ARBackgroundLayerProps {
  isARMode: boolean;
  backgroundBlur: number;
  parallaxOffset: { x: number; y: number };
  arIntensity: number;
  children: React.ReactNode;
}

export const ARBackgroundLayer: React.FC<ARBackgroundLayerProps> = ({
  isARMode,
  backgroundBlur,
  parallaxOffset,
  arIntensity,
  children
}) => {
  if (!isARMode) {
    return <>{children}</>;
  }

  return (
    <div className="relative w-full h-full">
      {/* Background blur overlay */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-300"
        style={{
          backdropFilter: `blur(${backgroundBlur}px)`,
          backgroundColor: `rgba(0, 0, 0, ${arIntensity * 0.1})`,
          transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`
        }}
      />
      
      {/* Atmospheric glow */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, rgba(0, 200, 81, ${arIntensity * 0.05}) 0%, transparent 70%)`,
          opacity: arIntensity
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
