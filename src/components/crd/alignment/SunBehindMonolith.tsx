import React from 'react';

interface SunBehindMonolithProps {
  phase: 'sun-rise' | 'moon-descent' | 'alignment' | 'climax';
  progress: number;
}

export const SunBehindMonolith: React.FC<SunBehindMonolithProps> = ({
  phase,
  progress
}) => {
  // Calculate sun position and intensity
  const getSunProperties = () => {
    switch (phase) {
      case 'sun-rise':
        return {
          intensity: Math.min(progress * 2, 1),
          position: -200 + (progress * 150), // Rise from below
          coronaOpacity: Math.min(progress * 3, 1)
        };
      case 'moon-descent':
      case 'alignment':
        return {
          intensity: 1,
          position: -50, // Positioned behind monolith
          coronaOpacity: 1
        };
      case 'climax':
        return {
          intensity: 1.5,
          position: -50,
          coronaOpacity: 1.2
        };
      default:
        return { intensity: 0, position: -200, coronaOpacity: 0 };
    }
  };

  const { intensity, position, coronaOpacity } = getSunProperties();

  if (intensity <= 0) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Sun positioned behind monolith */}
      <div 
        className="absolute"
        style={{
          top: '40%',
          left: '50%',
          transform: `translate(-50%, ${position}px)`,
          transition: 'all 0.8s ease-out'
        }}
      >
        {/* Main sun disc */}
        <div 
          className="rounded-full"
          style={{
            width: '120px',
            height: '120px',
            background: `radial-gradient(circle, 
              hsl(45, 100%, 95%) 0%, 
              hsl(40, 100%, 85%) 20%, 
              hsl(35, 100%, 75%) 40%, 
              hsl(30, 100%, 65%) 60%, 
              hsl(25, 100%, 55%) 80%, 
              hsl(20, 90%, 45%) 100%)`,
            opacity: intensity,
            boxShadow: `
              0 0 60px hsl(40, 100%, 60%, ${intensity * 0.8}),
              0 0 120px hsl(35, 100%, 50%, ${intensity * 0.6}),
              0 0 200px hsl(30, 100%, 40%, ${intensity * 0.4})
            `
          }}
        />

        {/* Corona rays extending beyond monolith edges */}
        <div className="absolute inset-0">
          {/* Left corona */}
          <div 
            className="absolute top-1/2 right-full"
            style={{
              width: '300px',
              height: '2px',
              background: `linear-gradient(to left, 
                hsl(40, 100%, 70%, ${coronaOpacity * 0.8}) 0%, 
                hsl(35, 100%, 60%, ${coronaOpacity * 0.4}) 50%, 
                transparent 100%)`,
              transform: 'translateY(-50%)',
              filter: 'blur(1px)'
            }}
          />
          
          {/* Right corona */}
          <div 
            className="absolute top-1/2 left-full"
            style={{
              width: '300px',
              height: '2px',
              background: `linear-gradient(to right, 
                hsl(40, 100%, 70%, ${coronaOpacity * 0.8}) 0%, 
                hsl(35, 100%, 60%, ${coronaOpacity * 0.4}) 50%, 
                transparent 100%)`,
              transform: 'translateY(-50%)',
              filter: 'blur(1px)'
            }}
          />

          {/* Top corona */}
          <div 
            className="absolute left-1/2 bottom-full"
            style={{
              width: '4px',
              height: '200px',
              background: `linear-gradient(to top, 
                hsl(40, 100%, 70%, ${coronaOpacity * 0.6}) 0%, 
                hsl(35, 100%, 60%, ${coronaOpacity * 0.3}) 50%, 
                transparent 100%)`,
              transform: 'translateX(-50%)',
              filter: 'blur(2px)'
            }}
          />

          {/* Additional corona rays */}
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute top-1/2 left-1/2"
              style={{
                width: '200px',
                height: '1px',
                background: `linear-gradient(to right, 
                  hsl(40, 100%, 60%, ${coronaOpacity * 0.3}) 0%, 
                  transparent 100%)`,
                transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                transformOrigin: 'left center',
                filter: 'blur(0.5px)'
              }}
            />
          ))}
        </div>

        {/* Atmospheric glow */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            width: '300px',
            height: '300px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, 
              transparent 30%, 
              hsl(40, 80%, 60%, ${intensity * 0.1}) 50%, 
              hsl(35, 70%, 50%, ${intensity * 0.05}) 70%, 
              transparent 100%)`,
            filter: 'blur(10px)'
          }}
        />
      </div>
    </div>
  );
};