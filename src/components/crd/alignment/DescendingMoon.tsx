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
        {/* Main moon body */}
        <div 
          className="relative"
          style={{
            width: '80px',
            height: '80px'
          }}
        >
          {/* Moon surface */}
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

          {/* Moon craters */}
          <div className="absolute inset-0">
            {/* Large crater */}
            <div 
              className="absolute rounded-full"
              style={{
                width: '12px',
                height: '12px',
                top: '35%',
                left: '40%',
                background: 'radial-gradient(circle, rgba(0,0,0,0.2) 0%, transparent 70%)',
                boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.4)'
              }}
            />
            
            {/* Medium crater */}
            <div 
              className="absolute rounded-full"
              style={{
                width: '8px',
                height: '8px',
                top: '60%',
                left: '25%',
                background: 'radial-gradient(circle, rgba(0,0,0,0.15) 0%, transparent 70%)',
                boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.3)'
              }}
            />

            {/* Small craters */}
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full"
                style={{
                  width: '4px',
                  height: '4px',
                  top: `${20 + (i * 15)}%`,
                  left: `${30 + (i * 10)}%`,
                  background: 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, transparent 70%)',
                  boxShadow: 'inset 0.5px 0.5px 1px rgba(0,0,0,0.2)'
                }}
              />
            ))}
          </div>

          {/* Moon glow/atmosphere */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              width: '140px',
              height: '140px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, 
                transparent 40%, 
                rgba(200,200,220,${glow * 0.1}) 60%, 
                rgba(180,180,200,${glow * 0.05}) 80%, 
                transparent 100%)`,
              filter: 'blur(5px)'
            }}
          />

          {/* Mystical aura for climax */}
          {phase === 'climax' && (
            <div 
              className="absolute inset-0"
              style={{
                width: '200px',
                height: '200px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle, 
                  transparent 30%, 
                  rgba(100,150,255,${glow * 0.1}) 50%, 
                  rgba(150,100,255,${glow * 0.05}) 70%, 
                  transparent 100%)`,
                filter: 'blur(10px)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};