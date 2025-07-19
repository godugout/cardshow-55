import React from 'react';

interface DescendingMoonProps {
  phase: 'moon-descent' | 'alignment' | 'climax';
  progress: number;
}

export const DescendingMoon: React.FC<DescendingMoonProps> = ({
  phase,
  progress
}) => {
  // Calculate moon position and properties
  const getMoonProperties = () => {
    switch (phase) {
      case 'moon-descent':
        return {
          opacity: Math.min(progress * 2, 1),
          positionY: -400 + (progress * 350), // Descend from top
          scale: 0.5 + (progress * 0.5), // Grow as it approaches
          glow: Math.min(progress * 1.5, 1)
        };
      case 'alignment':
        return {
          opacity: 1,
          positionY: -50, // Final position above monolith
          scale: 1,
          glow: 1
        };
      case 'climax':
        return {
          opacity: 1,
          positionY: -50,
          scale: 1.1,
          glow: 1.5
        };
      default:
        return { opacity: 0, positionY: -400, scale: 0.5, glow: 0 };
    }
  };

  const { opacity, positionY, scale, glow } = getMoonProperties();

  if (opacity <= 0) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Moon positioned above monolith */}
      <div 
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: `translate(-50%, ${positionY}px) scale(${scale})`,
          transition: 'all 0.8s ease-out',
          opacity
        }}
      >
        {/* Thin crescent moon */}
        <div 
          className="relative"
          style={{
            width: '80px',
            height: '80px'
          }}
        >
          {/* Main moon body - full circle first */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, 
                hsl(0, 0%, 85%) 0%, 
                hsl(0, 0%, 75%) 30%, 
                hsl(0, 0%, 65%) 60%, 
                hsl(0, 0%, 55%) 80%, 
                hsl(0, 0%, 45%) 100%)`,
              boxShadow: `
                inset -10px -10px 20px rgba(0,0,0,0.3),
                0 0 40px rgba(200,200,200,${glow * 0.3})
              `
            }}
          />

          {/* Crescent mask - creates the thin crescent by covering most of the moon */}
          <div 
            className="absolute inset-0 rounded-full bg-black"
            style={{
              clipPath: 'ellipse(65% 100% at 85% 50%)', // Creates thin crescent on left side
              transform: 'rotate(180deg)' // Rotates so curve faces down
            }}
          />

          {/* Moon surface details on visible crescent */}
          <div className="absolute inset-0" style={{ clipPath: 'ellipse(35% 100% at 15% 50%)' }}>
            {/* Large crater on crescent */}
            <div 
              className="absolute rounded-full"
              style={{
                width: '8px',
                height: '8px',
                top: '40%',
                left: '15%',
                background: 'radial-gradient(circle, rgba(0,0,0,0.2) 0%, transparent 70%)',
                boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.4)'
              }}
            />
            
            {/* Medium crater */}
            <div 
              className="absolute rounded-full"
              style={{
                width: '5px',
                height: '5px',
                top: '65%',
                left: '8%',
                background: 'radial-gradient(circle, rgba(0,0,0,0.15) 0%, transparent 70%)',
                boxShadow: 'inset 0.5px 0.5px 1px rgba(0,0,0,0.3)'
              }}
            />

            {/* Small craters */}
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full"
                style={{
                  width: '3px',
                  height: '3px',
                  top: `${30 + (i * 20)}%`,
                  left: `${5 + (i * 8)}%`,
                  background: 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, transparent 70%)',
                  boxShadow: 'inset 0.3px 0.3px 0.5px rgba(0,0,0,0.2)'
                }}
              />
            ))}
          </div>

          {/* Crescent glow/atmosphere */}
          <div 
            className="absolute inset-0"
            style={{
              width: '120px',
              height: '120px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(ellipse 40% 80% at 20% 50%, 
                rgba(200,200,220,${glow * 0.15}) 0%, 
                rgba(180,180,200,${glow * 0.08}) 60%, 
                transparent 100%)`,
              filter: 'blur(3px)',
              clipPath: 'ellipse(35% 100% at 15% 50%)' // Only glow on crescent
            }}
          />

          {/* Enhanced mystical aura for climax */}
          {phase === 'climax' && (
            <div 
              className="absolute inset-0"
              style={{
                width: '160px',
                height: '160px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(ellipse 30% 60% at 25% 50%, 
                  rgba(100,150,255,${glow * 0.15}) 0%, 
                  rgba(150,100,255,${glow * 0.08}) 50%, 
                  transparent 100%)`,
                filter: 'blur(8px)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};