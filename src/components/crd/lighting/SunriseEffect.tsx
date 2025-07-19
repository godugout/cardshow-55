import React from 'react';

interface SunriseEffectProps {
  intensity?: number;
}

export const SunriseEffect: React.FC<SunriseEffectProps> = ({ 
  intensity = 1 
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Subtle sunrise glow peeking over monolith */}
      <div 
        className="absolute"
        style={{
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '100px'
        }}
      >
        {/* Main glow */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 40% at center bottom, 
              hsl(45, 100%, 85%, ${intensity * 0.3}) 0%, 
              hsl(42, 100%, 75%, ${intensity * 0.2}) 30%, 
              hsl(40, 90%, 65%, ${intensity * 0.1}) 60%, 
              transparent 100%)`,
            filter: 'blur(20px)'
          }}
        />
        
        {/* Subtle rim light */}
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          style={{
            width: '300px',
            height: '4px',
            background: `linear-gradient(to right, 
              transparent 0%, 
              hsl(45, 100%, 90%, ${intensity * 0.4}) 50%, 
              transparent 100%)`,
            filter: 'blur(2px)'
          }}
        />
      </div>
    </div>
  );
};