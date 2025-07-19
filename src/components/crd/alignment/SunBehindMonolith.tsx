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
        {/* Realistic sun with layers */}
        <div 
          className="relative"
          style={{
            width: '140px',
            height: '140px'
          }}
        >
          {/* Sun core */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, 
                hsl(48, 100%, 98%) 0%, 
                hsl(46, 100%, 92%) 15%, 
                hsl(44, 100%, 85%) 30%, 
                hsl(42, 100%, 78%) 45%, 
                hsl(40, 100%, 70%) 60%, 
                hsl(38, 100%, 62%) 75%, 
                hsl(36, 95%, 55%) 85%, 
                hsl(34, 90%, 48%) 100%)`,
              opacity: intensity,
              boxShadow: `
                0 0 40px hsl(44, 100%, 70%, ${intensity * 0.8}),
                0 0 80px hsl(42, 100%, 65%, ${intensity * 0.6}),
                0 0 120px hsl(40, 100%, 60%, ${intensity * 0.4}),
                inset 0 0 20px hsl(50, 100%, 95%, ${intensity * 0.3})
              `
            }}
          />

          {/* Solar surface texture */}
          <div 
            className="absolute inset-1 rounded-full overflow-hidden"
            style={{ opacity: intensity * 0.7 }}
          >
            {/* Solar granulation pattern */}
            {[...Array(12)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${8 + Math.random() * 12}px`,
                  height: `${8 + Math.random() * 12}px`,
                  top: `${10 + Math.random() * 80}%`,
                  left: `${10 + Math.random() * 80}%`,
                  background: `radial-gradient(circle, 
                    hsl(${48 + Math.random() * 6}, 100%, ${85 + Math.random() * 10}%) 0%, 
                    transparent 70%)`,
                  filter: 'blur(1px)',
                  animation: `solar-flicker ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          {/* Solar prominences/flares */}
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute"
              style={{
                width: '3px',
                height: `${20 + Math.random() * 30}px`,
                top: '50%',
                left: '50%',
                transformOrigin: 'bottom center',
                transform: `translate(-50%, -50%) rotate(${i * 45 + Math.random() * 20}deg) translateY(-${70 + Math.random() * 20}px)`,
                background: `linear-gradient(to top, 
                  hsl(40, 100%, 70%, ${intensity * 0.8}) 0%, 
                  hsl(42, 100%, 75%, ${intensity * 0.6}) 50%, 
                  hsl(44, 100%, 80%, ${intensity * 0.4}) 80%, 
                  transparent 100%)`,
                filter: 'blur(1px)',
                opacity: coronaOpacity * 0.7
              }}
            />
          ))}

          {/* Enhanced corona rays */}
          <div className="absolute inset-0">
            {/* Main horizontal corona */}
            <div 
              className="absolute top-1/2 right-full"
              style={{
                width: '400px',
                height: '6px',
                background: `linear-gradient(to left, 
                  hsl(44, 100%, 75%, ${coronaOpacity * 0.9}) 0%, 
                  hsl(42, 100%, 68%, ${coronaOpacity * 0.7}) 30%, 
                  hsl(40, 100%, 60%, ${coronaOpacity * 0.5}) 60%, 
                  hsl(38, 100%, 50%, ${coronaOpacity * 0.3}) 80%, 
                  transparent 100%)`,
                transform: 'translateY(-50%)',
                filter: 'blur(2px)'
              }}
            />
            
            <div 
              className="absolute top-1/2 left-full"
              style={{
                width: '400px',
                height: '6px',
                background: `linear-gradient(to right, 
                  hsl(44, 100%, 75%, ${coronaOpacity * 0.9}) 0%, 
                  hsl(42, 100%, 68%, ${coronaOpacity * 0.7}) 30%, 
                  hsl(40, 100%, 60%, ${coronaOpacity * 0.5}) 60%, 
                  hsl(38, 100%, 50%, ${coronaOpacity * 0.3}) 80%, 
                  transparent 100%)`,
                transform: 'translateY(-50%)',
                filter: 'blur(2px)'
              }}
            />

            {/* Vertical corona */}
            <div 
              className="absolute left-1/2 bottom-full"
              style={{
                width: '8px',
                height: '300px',
                background: `linear-gradient(to top, 
                  hsl(44, 100%, 70%, ${coronaOpacity * 0.7}) 0%, 
                  hsl(42, 100%, 65%, ${coronaOpacity * 0.5}) 40%, 
                  hsl(40, 100%, 60%, ${coronaOpacity * 0.3}) 70%, 
                  transparent 100%)`,
                transform: 'translateX(-50%)',
                filter: 'blur(3px)'
              }}
            />

            {/* Diagonal corona rays */}
            {[...Array(16)].map((_, i) => (
              <div 
                key={i}
                className="absolute top-1/2 left-1/2"
                style={{
                  width: `${150 + Math.random() * 100}px`,
                  height: '2px',
                  background: `linear-gradient(to right, 
                    hsl(${42 + Math.random() * 4}, 100%, ${65 + Math.random() * 10}%, ${coronaOpacity * 0.4}) 0%, 
                    hsl(${40 + Math.random() * 4}, 100%, ${55 + Math.random() * 10}%, ${coronaOpacity * 0.2}) 50%, 
                    transparent 100%)`,
                  transform: `translate(-50%, -50%) rotate(${i * 22.5 + Math.random() * 10}deg)`,
                  transformOrigin: 'left center',
                  filter: 'blur(1px)',
                  opacity: 0.6 + Math.random() * 0.4
                }}
              />
            ))}
          </div>

          {/* Atmospheric distortion */}
          <div 
            className="absolute inset-0"
            style={{
              width: '200px',
              height: '200px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, 
                transparent 35%, 
                hsl(44, 80%, 70%, ${intensity * 0.08}) 50%, 
                hsl(42, 70%, 60%, ${intensity * 0.05}) 70%, 
                hsl(40, 60%, 50%, ${intensity * 0.02}) 85%, 
                transparent 100%)`,
              filter: 'blur(15px)',
              animation: phase === 'climax' ? 'solar-shimmer 3s ease-in-out infinite' : 'none'
            }}
          />
        </div>

        {/* CSS animations are handled via Tailwind classes */}
      </div>
    </div>
  );
};