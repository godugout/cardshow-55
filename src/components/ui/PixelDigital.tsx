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
    <span className={`relative inline-block ${className}`}>
      {/* Text with animated digital effects - pure CSS animations */}
      <span 
        className={`relative font-mono tracking-wider ${
          animationType === 'scanning' ? 'animate-scanning-fill' :
          animationType === 'matrix' ? 'animate-matrix-fill' :
          animationType === 'construction' ? 'animate-construction-fill' :
          animationType === 'datastream' ? 'animate-datastream-fill' : ''
        }`}
        style={{
          background: animationType === 'scanning' 
            ? 'linear-gradient(90deg, #001a1a 0%, #00e6ff 25%, #00b8e6 50%, #00a3d9 75%, #001a1a 100%)'
            : animationType === 'matrix' 
            ? 'linear-gradient(180deg, #00e6ff 0%, #001a1a 25%, #00b8e6 50%, #001a1a 75%, #00a3d9 100%)'
            : animationType === 'construction'
            ? 'linear-gradient(90deg, #001a1a 0%, #00e6ff 50%, #00b8e6 100%)'
            : animationType === 'datastream'
            ? 'linear-gradient(45deg, #00e6ff 0%, #001a1a 20%, #00b8e6 40%, #001a1a 60%, #00a3d9 80%, #00e6ff 100%)'
            : 'linear-gradient(45deg, #00e6ff, #00b8e6, #00a3d9, #008fb3)',
          backgroundSize: animationType === 'scanning' 
            ? '300% 100%'
            : animationType === 'matrix' 
            ? '100% 300%'
            : animationType === 'construction'
            ? '300% 100%'
            : animationType === 'datastream'
            ? '400% 100%'
            : '100% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {children}
      </span>
    </span>
  );
};