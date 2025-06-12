
import React from 'react';

interface ARDepthFieldProps {
  isARMode: boolean;
  arIntensity: number;
  cardPosition: { x: number; y: number };
}

export const ARDepthField: React.FC<ARDepthFieldProps> = ({
  isARMode,
  arIntensity,
  cardPosition
}) => {
  if (!isARMode) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {/* Depth field particles */}
      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-300"
        style={{
          background: `
            radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.1), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.1), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, 0.1), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.1), transparent),
            radial-gradient(2px 2px at 160px 30px, rgba(255, 255, 255, 0.1), transparent)
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 100px',
          transform: `translate(${cardPosition.x * 0.1}px, ${cardPosition.y * 0.1}px)`,
          opacity: arIntensity * 0.6
        }}
      />
      
      {/* Atmospheric haze */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `linear-gradient(45deg, 
            rgba(0, 200, 81, ${arIntensity * 0.02}) 0%, 
            transparent 30%, 
            rgba(0, 200, 81, ${arIntensity * 0.01}) 100%)`,
          opacity: arIntensity
        }}
      />
    </div>
  );
};
