import React, { useEffect, useRef, useState } from 'react';

interface GlitchyArtProps {
  children: string;
  className?: string;
}

export const GlitchyArt: React.FC<GlitchyArtProps> = ({ 
  children, 
  className = "" 
}) => {
  const [glitchPhase, setGlitchPhase] = useState(0);
  const [pixelNoise, setPixelNoise] = useState<number[]>([]);

  useEffect(() => {
    // Generate pixel noise pattern
    const noise = Array.from({ length: 50 }, () => Math.random());
    setPixelNoise(noise);

    // Glitch animation cycle
    const interval = setInterval(() => {
      setGlitchPhase(prev => (prev + 1) % 6);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Dynamic glitch effects based on phase
  const getGlitchStyles = () => {
    const baseHue = glitchPhase * 60; // Cycle through colors
    const glitchIntensity = Math.sin(Date.now() * 0.008) * 0.5 + 0.5;
    
    return {
      textShadow: `
        ${glitchPhase % 2 === 0 ? '2px' : '-2px'} 0 0 #ff00ff,
        ${glitchPhase % 3 === 0 ? '-2px' : '2px'} 0 0 #00ffff,
        0 0 ${8 + glitchIntensity * 12}px hsl(${baseHue}, 100%, 60%),
        0 0 ${16 + glitchIntensity * 20}px hsl(${baseHue + 180}, 80%, 50%),
        ${glitchPhase % 2 === 0 ? '1px' : '-1px'} ${glitchPhase % 2 === 0 ? '1px' : '-1px'} 0 #000
      `,
      background: `
        linear-gradient(
          ${45 + glitchPhase * 30}deg, 
          hsl(${baseHue}, 90%, 65%), 
          hsl(${baseHue + 60}, 85%, 55%), 
          hsl(${baseHue + 120}, 80%, 60%),
          hsl(${baseHue + 180}, 90%, 50%)
        )
      `,
      filter: `
        contrast(${1.2 + glitchIntensity * 0.3}) 
        brightness(${0.9 + glitchIntensity * 0.4}) 
        hue-rotate(${glitchPhase * 15}deg)
      `,
      transform: `
        scale(${1 + glitchIntensity * 0.05}) 
        skew(${(glitchPhase % 2 === 0 ? 1 : -1) * glitchIntensity * 2}deg, ${glitchIntensity * 1}deg)
      `,
    };
  };

  return (
    <span 
      className={`relative inline-block ${className}`}
      style={{ position: 'relative' }}
    >
      {/* Animated pixel noise background */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at ${pixelNoise[0] * 100}% ${pixelNoise[1] * 100}%, #ff00ff40 1px, transparent 2px),
            radial-gradient(circle at ${pixelNoise[2] * 100}% ${pixelNoise[3] * 100}%, #00ffff40 1px, transparent 2px),
            radial-gradient(circle at ${pixelNoise[4] * 100}% ${pixelNoise[5] * 100}%, #ffff0040 1px, transparent 2px)
          `,
          backgroundSize: '20px 20px, 15px 15px, 25px 25px',
          animation: 'pixelShift 1.6s infinite ease-in-out',
        }}
      />
      
      {/* Main glitchy text */}
      <span 
        className="relative z-10 font-mono tracking-wider font-bold"
        style={{
          ...getGlitchStyles(),
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'digitalGlitch 0.4s infinite ease-in-out',
        }}
      >
        {children}
      </span>
      
      {/* Glitch artifacts */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            repeating-linear-gradient(
              ${90 + glitchPhase * 45}deg,
              transparent,
              transparent ${3 + glitchPhase}px,
              rgba(255, 0, 255, 0.1) ${3 + glitchPhase}px,
              rgba(255, 0, 255, 0.1) ${4 + glitchPhase}px,
              transparent ${4 + glitchPhase}px,
              transparent ${8 + glitchPhase * 2}px,
              rgba(0, 255, 255, 0.1) ${8 + glitchPhase * 2}px,
              rgba(0, 255, 255, 0.1) ${9 + glitchPhase * 2}px
            )
          `,
          opacity: 0.6,
          animation: 'artifactShift 0.8s infinite ease-in-out',
        }}
      />
      
      {/* Digital scan lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(0, 255, 255, 0.3) 1px,
              rgba(0, 255, 255, 0.3) 2px
            )
          `,
          animation: 'scanLines 2s infinite linear',
        }}
      />
      
      <style>{`
        @keyframes digitalGlitch {
          0%, 100% { transform: translateX(0) scale(1); }
          10% { transform: translateX(-1px) scale(1.01); }
          20% { transform: translateX(1px) scale(0.99); }
          30% { transform: translateX(-0.5px) scale(1.02); }
          40% { transform: translateX(0.5px) scale(0.98); }
          50% { transform: translateX(-1px) scale(1.01); }
          60% { transform: translateX(1px) scale(0.99); }
          70% { transform: translateX(-0.5px) scale(1.01); }
          80% { transform: translateX(0.5px) scale(0.99); }
          90% { transform: translateX(-1px) scale(1.01); }
        }
        
        @keyframes pixelShift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-1px, 1px); }
          50% { transform: translate(1px, -1px); }
          75% { transform: translate(-0.5px, 0.5px); }
        }
        
        @keyframes artifactShift {
          0%, 100% { transform: translateY(0) skew(0deg); }
          33% { transform: translateY(-1px) skew(0.5deg); }
          66% { transform: translateY(1px) skew(-0.5deg); }
        }
        
        @keyframes scanLines {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </span>
  );
};