
import React from 'react';

interface ARBackgroundLayerProps {
  isARMode: boolean;
  blurIntensity: number;
  parallaxOffset: { x: number; y: number };
  children: React.ReactNode;
}

export const ARBackgroundLayer: React.FC<ARBackgroundLayerProps> = ({
  isARMode,
  blurIntensity,
  parallaxOffset,
  children
}) => {
  if (!isARMode) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* AR Depth Field Effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, 
            rgba(0, 200, 81, 0.05) 0%, 
            rgba(0, 0, 0, 0.1) 50%, 
            rgba(0, 0, 0, 0.2) 100%
          )`,
          transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      />
      
      {/* Blurred Background Content */}
      <div
        style={{
          filter: blurIntensity > 0 ? `blur(${blurIntensity}px)` : 'none',
          transition: 'filter 0.3s ease-out'
        }}
      >
        {children}
      </div>
      
      {/* AR Grid Overlay */}
      {isARMode && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 200, 81, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 200, 81, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: `translate(${parallaxOffset.x * 0.5}px, ${parallaxOffset.y * 0.5}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        />
      )}
    </div>
  );
};
