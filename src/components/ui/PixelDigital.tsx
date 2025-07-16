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

  const getAnimationStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      fontFamily: '"Courier New", "Consolas", "Monaco", monospace',
      letterSpacing: '0.1em',
      fontWeight: '700',
      fontSize: '1em',
      position: 'relative',
      display: 'inline-block',
      color: '#00ff41',
      textShadow: '0 0 10px #00ff41',
    };

    const glitchStyle: React.CSSProperties = {
      ...baseStyle,
      animation: 'glitch 2s infinite',
    };

    const staticStyle: React.CSSProperties = {
      ...baseStyle,
      animation: 'static 0.1s infinite',
    };

    const scanStyle: React.CSSProperties = {
      ...baseStyle,
      animation: 'scan 3s infinite',
    };

    switch (animationType) {
      case 'scanning':
        return scanStyle;
      case 'matrix':
        return {
          ...baseStyle,
          animation: 'matrix-rain 2s infinite',
          color: '#00ff41',
        };
      case 'construction':
        return glitchStyle;
      case 'datastream':
        return staticStyle;
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
      
      {/* Glitch overlay effect */}
      <span 
        className="absolute inset-0 font-mono tracking-wider select-none pointer-events-none"
        style={{
          ...getAnimationStyle(),
          color: '#ff0080',
          opacity: 0.3,
          animation: 'glitch-overlay 1.5s infinite',
          transform: 'translate(-1px, 0)',
        }}
      >
        {children}
      </span>
      
      {/* Static noise overlay */}
      <span 
        className="absolute inset-0 font-mono tracking-wider select-none pointer-events-none"
        style={{
          ...getAnimationStyle(),
          color: '#0080ff',
          opacity: 0.2,
          animation: 'static-noise 0.3s infinite',
          transform: 'translate(1px, 0)',
        }}
      >
        {children}
      </span>
    </span>
  );
};