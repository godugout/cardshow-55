import React from 'react';

interface PixelDigitalProps {
  children: string;
  className?: string;
  animationType?: 'scanning' | 'matrix' | 'construction' | 'datastream';
}

export const PixelDigital: React.FC<PixelDigitalProps> = ({ 
  children, 
  className = "",
  animationType = "scanning"
}) => {
  // Generate distinct pixel blocks using box-shadow to create LED-like effect
  const generatePixelBlocks = () => {
    const pixels = [];
    const pixelSize = 2; // Size of each pixel in px
    const pixelColors = ['#00e6ff', '#00b8e6', '#00a3d9', '#008fb3'];
    
    // Create a grid of distinct pixels
    for (let x = -6; x <= 6; x += 2) {
      for (let y = -6; y <= 6; y += 2) {
        const colorIndex = (Math.abs(x / 2) + Math.abs(y / 2)) % pixelColors.length;
        const opacity = Math.random() > 0.4 ? 1 : 0.6; // Random opacity for pixel variation
        pixels.push(`${x}px ${y}px 0px ${pixelColors[colorIndex]}${opacity >= 1 ? '' : Math.floor(opacity * 100).toString(16)}`);
      }
    }
    
    return pixels.join(', ');
  };

  const getAnimationStyle = () => {
    const baseStyle: React.CSSProperties = {
      fontFamily: 'monospace',
      letterSpacing: '0.2em',
      fontWeight: '900',
      fontSize: '1em',
      // Use a pixelated approach with distinct blocks
      textShadow: generatePixelBlocks(),
      color: 'transparent',
      // Add pixelated background pattern
      background: `
        radial-gradient(circle at 25% 25%, #00e6ff 0.5px, transparent 0.5px),
        radial-gradient(circle at 75% 25%, #00b8e6 0.5px, transparent 0.5px),
        radial-gradient(circle at 25% 75%, #00a3d9 0.5px, transparent 0.5px),
        radial-gradient(circle at 75% 75%, #008fb3 0.5px, transparent 0.5px)
      `,
      backgroundSize: '4px 4px, 4px 4px, 4px 4px, 4px 4px',
      backgroundPosition: '0 0, 2px 0, 0 2px, 2px 2px',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      // Add sharp pixelated rendering
      imageRendering: 'pixelated' as any,
    };

    switch (animationType) {
      case 'scanning':
        return {
          ...baseStyle,
          background: `
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 1px,
              #00e6ff 1px,
              #00e6ff 2px,
              transparent 2px,
              transparent 3px,
              #00b8e6 3px,
              #00b8e6 4px
            ),
            linear-gradient(
              90deg,
              transparent 0%,
              rgba(0, 230, 255, 0.8) 50%,
              transparent 100%
            )
          `,
          backgroundSize: '8px 100%, 200% 100%',
          animation: 'scanning-sweep 3s ease-in-out infinite',
        };
        
      case 'matrix':
        return {
          ...baseStyle,
          background: `
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 1px,
              #00e6ff 1px,
              #00e6ff 2px,
              transparent 2px,
              transparent 3px,
              #00b8e6 3px,
              #00b8e6 4px
            )
          `,
          backgroundSize: '100% 8px',
          animation: 'matrix-cascade 2s linear infinite',
        };
        
      case 'construction':
        return {
          ...baseStyle,
          background: `
            repeating-conic-gradient(
              from 0deg,
              #00e6ff 0deg 90deg,
              #00b8e6 90deg 180deg,
              #00a3d9 180deg 270deg,
              #008fb3 270deg 360deg
            )
          `,
          backgroundSize: '4px 4px',
          animation: 'construction-build 1.5s ease-in-out infinite',
        };
        
      case 'datastream':
        return {
          ...baseStyle,
          background: `
            repeating-linear-gradient(
              45deg,
              #00e6ff 0px,
              #00e6ff 1px,
              transparent 1px,
              transparent 2px,
              #00b8e6 2px,
              #00b8e6 3px,
              transparent 3px,
              transparent 4px
            )
          `,
          backgroundSize: '8px 8px',
          animation: 'datastream-flow 2.5s linear infinite',
        };
        
      default:
        return baseStyle;
    }
  };

  return (
    <span className={`relative inline-block ${className}`}>
      <span 
        className="relative z-10 font-mono tracking-wider select-none"
        style={getAnimationStyle()}
      >
        {children}
      </span>
    </span>
  );
};