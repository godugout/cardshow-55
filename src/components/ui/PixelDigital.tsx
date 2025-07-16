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
    <span className={`font-mono tracking-wider select-none ${className}`} 
          style={{
            fontFamily: '"Courier New", "Consolas", "Monaco", monospace',
            letterSpacing: '0.1em',
            fontWeight: '700',
            color: '#00ff41',
            textShadow: '0 0 10px #00ff41',
            animation: animationType === 'scanning' ? 'scan 3s infinite' : 
                      animationType === 'construction' ? 'glitch 2s infinite' : 
                      'none'
          }}>
      {children}
    </span>
  );
};