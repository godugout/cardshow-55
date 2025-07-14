
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
  const [pixels, setPixels] = useState<{ delay: number; color: string }[]>([]);

  useEffect(() => {
    // Generate pixels for each letter
    const letterPixels: { delay: number; color: string }[] = [];
    
    text.split('').forEach((letter, letterIndex) => {
      if (letter !== ' ') {
        // Create a 5x7 grid for each letter
        for (let row = 0; row < 7; row++) {
          for (let col = 0; col < 5; col++) {
            letterPixels.push({
              delay: (letterIndex * 0.1) + (row * 0.05) + (col * 0.02),
              color: getRandomColor(),
            });
          }
        }
      }
    });
    
    setPixels(letterPixels);
  }, [text]);

  return (
    <span
      className={cn("inline-block relative cursor-pointer", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Original text (invisible but maintains space) */}
      <span className="invisible font-extrabold">{text}</span>
      
      {/* Pixel overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(4px,1fr))] gap-[1px] w-full h-full">
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
