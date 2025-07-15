
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedPixelTextProps {
  text: string;
  className?: string;
}

const COLORS = [
  'hsl(var(--crd-orange))',
  'hsl(var(--crd-green))',
  'hsl(var(--crd-blue))',
  'hsl(var(--crd-purple))',
];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];
const getRandomDelay = () => Math.random() * 2;

interface PixelProps {
  delay: number;
  color: string;
  isActive: boolean;
}

const Pixel: React.FC<PixelProps> = ({ delay, color, isActive }) => {
  const [currentColor, setCurrentColor] = useState(color);
  
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setCurrentColor(getRandomColor());
      }, 500 + Math.random() * 1000);
      
      return () => clearInterval(interval);
    }
  }, [isActive]);

  return (
    <div
      className={cn(
        "w-1 h-1 transition-all duration-300 will-change-transform",
        isActive ? "animate-pixel-pulse" : "animate-pixel-shimmer"
      )}
      style={{
        backgroundColor: currentColor,
        animationDelay: `${delay}s`,
      }}
    />
  );
};

export const AnimatedPixelText: React.FC<AnimatedPixelTextProps> = ({ 
  text, 
  className 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [pixels] = useState(() => {
    // Generate a grid of pixels to fill the text area
    const pixelArray = [];
    const rows = 8; // Height of text in pixels
    const cols = text.length * 6; // Width based on character count
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        pixelArray.push({
          delay: (row * 0.05) + (col * 0.02),
          color: getRandomColor(),
        });
      }
    }
    return pixelArray;
  });

  return (
    <span
      className={cn("inline-block relative cursor-pointer", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Original text for masking */}
      <span 
        className="font-extrabold text-transparent bg-clip-text relative z-10"
        style={{
          WebkitTextStroke: '1px transparent',
          backgroundImage: 'linear-gradient(135deg, transparent, transparent)',
        }}
      >
        {text}
      </span>
      
      {/* Pixel overlay with text mask */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{
          WebkitMask: `linear-gradient(black, black)`,
          WebkitMaskComposite: 'source-in',
          mask: `url("data:image/svg+xml,${encodeURIComponent(`
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40'>
              <text x='0' y='30' font-family='system-ui, -apple-system, sans-serif' font-weight='800' font-size='24' fill='black'>${text}</text>
            </svg>
          `)}")`,
          maskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
        }}
      >
        <div 
          className="grid gap-[1px] w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${text.length * 6}, minmax(0, 1fr))`,
            gridTemplateRows: 'repeat(8, minmax(0, 1fr))',
          }}
        >
          {pixels.map((pixel, index) => (
            <Pixel
              key={index}
              delay={pixel.delay}
              color={pixel.color}
              isActive={isHovered}
            />
          ))}
        </div>
      </div>
      
      {/* Floating particles effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 animate-pixel-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: getRandomColor(),
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}
    </span>
  );
};
