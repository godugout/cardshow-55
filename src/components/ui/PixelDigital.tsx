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
  // Generate pixelated text shadows to simulate digital pixels inside letters
  const generatePixelShadows = () => {
    const shadows = [];
    const colors = ['#00e6ff', '#00b8e6', '#00a3d9', '#008fb3'];
    
    // Create a grid of small shadows to simulate pixels within the text
    for (let x = -1; x <= 1; x += 0.5) {
      for (let y = -1; y <= 1; y += 0.5) {
        if (x === 0 && y === 0) continue;
        const colorIndex = (Math.abs(x * 2) + Math.abs(y * 2)) % colors.length;
        const opacity = Math.random() > 0.6 ? '88' : '44'; // Random opacity for pixel effect
        shadows.push(`${x}px ${y}px 0px ${colors[colorIndex]}${opacity}`);
      }
    }
    
    return shadows.join(', ');
  };

  const getAnimationStyle = () => {
    const baseStyle = {
      fontFamily: 'monospace',
      letterSpacing: '0.1em',
      fontWeight: 'bold',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      color: 'transparent',
      // Add pixelated shadows inside the text
      filter: 'contrast(1.5) brightness(1.2)',
    };

    switch (animationType) {
      case 'scanning':
        return {
          ...baseStyle,
          background: `
            repeating-linear-gradient(
              90deg,
              #00e6ff 0px,
              #00e6ff 2px,
              #00b8e6 2px,
              #00b8e6 4px,
              #00a3d9 4px,
              #00a3d9 6px,
              #008fb3 6px,
              #008fb3 8px
            ),
            linear-gradient(
              90deg,
              transparent 0%,
              rgba(0, 230, 255, 0.8) 30%,
              rgba(0, 184, 230, 0.9) 50%,
              rgba(0, 163, 217, 0.8) 70%,
              transparent 100%
            )
          `,
          backgroundSize: '8px 100%, 300% 100%',
          animation: 'scanning-sweep 3s ease-in-out infinite',
          textShadow: generatePixelShadows(),
        };
        
      case 'matrix':
        return {
          ...baseStyle,
          background: `
            repeating-linear-gradient(
              0deg,
              #00e6ff 0px,
              #00e6ff 1px,
              #00b8e6 1px,
              #00b8e6 2px,
              #00a3d9 2px,
              #00a3d9 3px,
              #008fb3 3px,
              #008fb3 4px
            ),
            linear-gradient(
              180deg,
              rgba(0, 230, 255, 0.9) 0%,
              rgba(0, 184, 230, 0.7) 50%,
              rgba(0, 163, 217, 0.9) 100%
            )
          `,
          backgroundSize: '100% 4px, 100% 400%',
          animation: 'matrix-cascade 2s linear infinite',
          textShadow: generatePixelShadows(),
        };
        
      case 'construction':
        return {
          ...baseStyle,
          background: `
            repeating-linear-gradient(
              45deg,
              #00e6ff 0px,
              #00e6ff 3px,
              #00b8e6 3px,
              #00b8e6 6px,
              #00a3d9 6px,
              #00a3d9 9px,
              #008fb3 9px,
              #008fb3 12px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent 0px,
              transparent 2px,
              rgba(0, 230, 255, 0.3) 2px,
              rgba(0, 230, 255, 0.3) 4px
            )
          `,
          backgroundSize: '12px 12px, 8px 8px',
          animation: 'construction-build 1.5s ease-in-out infinite',
          textShadow: generatePixelShadows(),
        };
        
      case 'datastream':
        return {
          ...baseStyle,
          background: `
            repeating-linear-gradient(
              135deg,
              #00e6ff 0px,
              #00e6ff 2px,
              #00b8e6 2px,
              #00b8e6 4px,
              #00a3d9 4px,
              #00a3d9 6px,
              #008fb3 6px,
              #008fb3 8px
            ),
            linear-gradient(
              45deg,
              rgba(0, 230, 255, 0.8) 0%,
              rgba(0, 184, 230, 0.6) 25%,
              rgba(0, 163, 217, 0.8) 50%,
              rgba(0, 143, 179, 0.6) 75%,
              rgba(0, 230, 255, 0.8) 100%
            )
          `,
          backgroundSize: '8px 8px, 400% 100%',
          animation: 'datastream-flow 2.5s linear infinite',
          textShadow: generatePixelShadows(),
        };
        
      default:
        return {
          ...baseStyle,
          background: `
            repeating-linear-gradient(
              90deg,
              #00e6ff 0px,
              #00e6ff 2px,
              #00b8e6 2px,
              #00b8e6 4px,
              #00a3d9 4px,
              #00a3d9 6px,
              #008fb3 6px,
              #008fb3 8px
            )
          `,
          backgroundSize: '8px 100%',
          textShadow: generatePixelShadows(),
        };
    }
  };

  return (
    <span className={`relative inline-block ${className}`}>
      <span 
        className="relative z-10 font-mono tracking-wider"
        style={getAnimationStyle()}
      >
        {children}
      </span>
    </span>
  );
};