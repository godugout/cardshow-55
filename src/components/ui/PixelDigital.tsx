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

  return (
    <span 
      className={`relative inline-block ${className}`}
    >
      {/* Text with animated digital effects - pure CSS animations */}
      <span 
        className={`relative font-mono tracking-wider ${
          animationType === 'scanning' ? 'animate-scanning-fill' :
          animationType === 'matrix' ? 'animate-matrix-fill' :
          animationType === 'construction' ? 'animate-construction-fill' :
          animationType === 'datastream' ? 'animate-datastream-fill' : ''
        }`}
        style={{
          textShadow: `
            0 0 4px #00e6ff,
            0 0 8px #00b8e6,
            0 0 12px #00a3d9,
            1px 1px 0px #003d4d,
            -1px -1px 0px #003d4d
          `,
          background: animationType === 'scanning' 
            ? 'linear-gradient(90deg, transparent 0%, #00e6ff 25%, #00b8e6 50%, #00a3d9 75%, transparent 100%)'
            : animationType === 'matrix' 
            ? 'linear-gradient(180deg, #00e6ff 0%, #00b8e6 33%, #00a3d9 66%, #008fb3 100%)'
            : animationType === 'construction'
            ? 'linear-gradient(90deg, #00e6ff 0%, #00b8e6 100%)'
            : animationType === 'datastream'
            ? 'linear-gradient(45deg, #00e6ff 0%, #00b8e6 25%, #00a3d9 50%, #008fb3 75%, #00e6ff 100%)'
            : 'linear-gradient(45deg, #00e6ff, #00b8e6, #00a3d9, #008fb3)',
          backgroundSize: animationType === 'scanning' 
            ? '200% 100%'
            : animationType === 'matrix' 
            ? '100% 200%'
            : animationType === 'construction'
            ? '200% 100%'
            : animationType === 'datastream'
            ? '300% 100%'
            : '100% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'contrast(1.3) brightness(1.2)',
        }}
      >
        {children}
      </span>
    </span>
  );
};