
import React from 'react';

interface CardBackLogoProps {
  isHovering: boolean;
  mousePosition: { x: number; y: number };
  interactiveLighting?: boolean;
}

export const CardBackLogo: React.FC<CardBackLogoProps> = ({
  isHovering,
  mousePosition,
  interactiveLighting = false
}) => {
  // Calculate dynamic lighting based on mouse position
  const lightingStyle = React.useMemo(() => {
    if (!interactiveLighting || !isHovering) {
      return {};
    }

    const lightX = (mousePosition.x - 0.5) * 50;
    const lightY = (mousePosition.y - 0.5) * 50;
    
    return {
      filter: `brightness(${1.1 + mousePosition.x * 0.2}) contrast(1.1)`,
      transform: `translate(${lightX * 0.1}px, ${lightY * 0.1}px)`,
      transition: 'all 0.1s ease'
    };
  }, [interactiveLighting, isHovering, mousePosition]);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(0, 200, 81, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(0, 200, 81, 0.1) 0%, transparent 50%),
              linear-gradient(45deg, transparent 30%, rgba(0, 200, 81, 0.05) 50%, transparent 70%)
            `,
            backgroundSize: '50% 50%, 50% 50%, 100% 100%',
            backgroundPosition: '0 0, 100% 100%, 0 0'
          }}
        />
      </div>

      {/* Main CRD Logo */}
      <div 
        className="relative z-30"
        style={{
          ...lightingStyle,
          filter: `${lightingStyle.filter || ''} drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))`
        }}
      >
        <img 
          src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
          alt="CRD Logo" 
          className={`w-32 h-auto transition-all duration-300 ${
            isHovering ? 'scale-110 opacity-90' : 'opacity-70'
          }`}
          style={{
            filter: 'brightness(1.1) contrast(1.1)',
          }}
          onLoad={() => console.log('Card back CRD logo loaded successfully')}
          onError={() => console.log('Error loading card back CRD logo')}
        />
      </div>

      {/* Enhanced glow effect */}
      {isHovering && (
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(0, 200, 81, 0.2) 0%, 
              rgba(0, 200, 81, 0.1) 30%, 
              transparent 60%)`,
            transition: 'background 0.2s ease'
          }}
        />
      )}

      {/* Subtle text below logo */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30">
        <p className="text-white/40 text-xs font-mono tracking-wider">
          COLLECTIBLE • RARE • DIGITAL
        </p>
      </div>
    </div>
  );
};
