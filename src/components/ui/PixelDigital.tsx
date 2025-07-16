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

  const getAnimationStyle = () => {
    const baseStyle: React.CSSProperties = {
      fontFamily: 'monospace',
      letterSpacing: '0.2em',
      fontWeight: '900',
      fontSize: '1em',
      color: 'transparent',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      imageRendering: 'pixelated' as any,
    };

    switch (animationType) {
      case 'scanning':
        return {
          ...baseStyle,
          background: `
            repeating-linear-gradient(
              90deg,
              #00e6ff 0px,
              #00e6ff 1px,
              transparent 1px,
              transparent 2px
            )
          `,
          backgroundSize: '4px 100%',
          animation: 'scanning-sweep 3s ease-in-out infinite',
        };
        
      case 'matrix':
        return {
          ...baseStyle,
          background: `
            repeating-linear-gradient(
              0deg,
              #00e6ff 0px,
              #00e6ff 1px,
              transparent 1px,
              transparent 2px
            )
          `,
          backgroundSize: '100% 4px',
          animation: 'matrix-cascade 2s linear infinite',
        };
        
      case 'construction':
        return {
          ...baseStyle,
          background: `
            repeating-linear-gradient(
              45deg,
              #00e6ff 0px,
              #00e6ff 2px,
              #00b8e6 2px,
              #00b8e6 4px
            )
          `,
          backgroundSize: '8px 8px',
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
        return {
          ...baseStyle,
          background: `
            repeating-linear-gradient(
              90deg,
              #00e6ff 0px,
              #00e6ff 1px,
              transparent 1px,
              transparent 2px
            )
          `,
          backgroundSize: '4px 100%',
        };
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