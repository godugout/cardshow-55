
import React from 'react';

interface CardBackLogoProps {
  isHovering: boolean;
  mousePosition: { x: number; y: number };
  interactiveLighting: boolean;
}

export const CardBackLogo: React.FC<CardBackLogoProps> = ({
  isHovering,
  mousePosition,
  interactiveLighting
}) => {
  return (
    <>
      {/* CRD Logo Background */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <img 
          src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
          alt="CRD Logo" 
          className="w-64 h-auto opacity-60"
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            pointerEvents: 'none'
          }}
          draggable={false}
        />
      </div>

      {/* Interactive Lighting on Back - Top Layer */}
      {interactiveLighting && isHovering && (
        <div className="absolute inset-0 pointer-events-none z-40">
          <div
            style={{
              background: `radial-gradient(
                ellipse 200% 150% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(255, 255, 255, 0.12) 0%,
                rgba(255, 255, 255, 0.06) 30%,
                transparent 70%
              )`,
              mixBlendMode: 'overlay',
              transition: 'opacity 0.2s ease'
            }}
          />
        </div>
      )}
    </>
  );
};
