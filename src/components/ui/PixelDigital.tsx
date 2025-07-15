import React, { useEffect, useRef, useState } from 'react';

interface PixelDigitalProps {
  children: string;
  className?: string;
}

export const PixelDigital: React.FC<PixelDigitalProps> = ({ 
  children, 
  className = "" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2; // Higher resolution
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Pixel grid settings
    const gridSize = 3;
    const cols = Math.floor(rect.width / gridSize);
    const rows = Math.floor(rect.height / gridSize);

    // Animation state
    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      // Create animated pixel patterns
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const wave1 = Math.sin((x * 0.1) + (time * 0.02)) * 0.5 + 0.5;
          const wave2 = Math.cos((y * 0.1) + (time * 0.015)) * 0.5 + 0.5;
          const wave3 = Math.sin(((x + y) * 0.05) + (time * 0.01)) * 0.5 + 0.5;
          
          // Combine waves for interesting patterns
          const intensity = (wave1 * wave2 * wave3) * 0.8;
          
          // Color variations (blue to green digital palette)
          const hue = 180 + (wave3 * 60); // Blue to cyan range
          const saturation = 70 + (intensity * 30);
          const lightness = 20 + (intensity * 60);
          
          ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          ctx.fillRect(x * gridSize, y * gridSize, gridSize - 0.5, gridSize - 0.5);
        }
      }
      
      time += 1;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <span className={`inline-block ${className}`}>
        {children}
      </span>
    );
  }

  return (
    <span 
      className={`relative inline-block ${className}`}
      style={{ position: 'relative' }}
    >
      {/* Pixel grid background */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 opacity-40"
        style={{
          width: '100%',
          height: '100%',
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Text with digital effect */}
      <span 
        className="relative z-10 font-mono tracking-wider"
        style={{
          textShadow: `
            0 0 10px #00ffff,
            0 0 20px #00ffff,
            0 0 30px #00ffff,
            2px 2px 0px #004444,
            -2px -2px 0px #004444
          `,
          background: 'linear-gradient(45deg, #00ffff, #0088ff, #00ffaa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'contrast(1.2) brightness(1.1)',
        }}
      >
        {children}
      </span>
      
      {/* Glitch lines overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              #00ffff 2px,
              #00ffff 3px
            )
          `,
          animation: 'pixelGlitch 2s infinite ease-in-out',
        }}
      />
      
      <style>{`
        @keyframes pixelGlitch {
          0%, 100% { transform: translateY(0px); opacity: 0.1; }
          10% { transform: translateY(-1px); opacity: 0.3; }
          20% { transform: translateY(1px); opacity: 0.2; }
          30% { transform: translateY(-0.5px); opacity: 0.4; }
          40% { transform: translateY(0.5px); opacity: 0.1; }
          50% { transform: translateY(-1px); opacity: 0.3; }
          60% { transform: translateY(1px); opacity: 0.2; }
          70% { transform: translateY(-0.5px); opacity: 0.1; }
          80% { transform: translateY(0.5px); opacity: 0.4; }
          90% { transform: translateY(-1px); opacity: 0.2; }
        }
      `}</style>
    </span>
  );
};