import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface CosmicMoonProps {
  progress: number;
  isVisible: boolean;
}

interface MoonFrame {
  progress: number;
  moon: {
    x: number; // Screen percentage relative to sun
    y: number; // Screen percentage 
    scale: number;
    opacity: number;
    phase: number; // 0-1 crescent phase
  };
}

// Moon keyframes - positioned between quote and card top edge
const MOON_FRAMES: MoonFrame[] = [
  {
    progress: 0,
    moon: { x: 15, y: 35, scale: 0.3, opacity: 0.6, phase: 0.3 }
  },
  {
    progress: 0.5,
    moon: { x: 12, y: 42, scale: 0.4, opacity: 0.8, phase: 0.25 }
  },
  {
    progress: 1.0,
    moon: { x: 10, y: 48, scale: 0.5, opacity: 0.9, phase: 0.2 }
  }
];

export const CosmicMoon: React.FC<CosmicMoonProps> = ({
  progress,
  isVisible
}) => {
  const moonRef = useRef<HTMLDivElement>(null);
  const crescentRef = useRef<HTMLDivElement>(null);

  // Interpolate between moon keyframes
  const getCurrentMoonFrame = (progress: number): MoonFrame => {
    if (progress <= 0) return MOON_FRAMES[0];
    if (progress >= 1) return MOON_FRAMES[MOON_FRAMES.length - 1];

    let nextFrameIndex = MOON_FRAMES.findIndex(frame => frame.progress > progress);
    if (nextFrameIndex === -1) nextFrameIndex = MOON_FRAMES.length - 1;
    
    const prevFrame = MOON_FRAMES[nextFrameIndex - 1] || MOON_FRAMES[0];
    const nextFrame = MOON_FRAMES[nextFrameIndex];
    
    const frameProgress = (progress - prevFrame.progress) / (nextFrame.progress - prevFrame.progress);
    const t = Math.max(0, Math.min(1, frameProgress));
    
    return {
      progress,
      moon: {
        x: THREE.MathUtils.lerp(prevFrame.moon.x, nextFrame.moon.x, t),
        y: THREE.MathUtils.lerp(prevFrame.moon.y, nextFrame.moon.y, t),
        scale: THREE.MathUtils.lerp(prevFrame.moon.scale, nextFrame.moon.scale, t),
        opacity: THREE.MathUtils.lerp(prevFrame.moon.opacity, nextFrame.moon.opacity, t),
        phase: THREE.MathUtils.lerp(prevFrame.moon.phase, nextFrame.moon.phase, t),
      }
    };
  };

  const currentFrame = getCurrentMoonFrame(progress);

  // Update moon position and appearance
  useEffect(() => {
    if (moonRef.current && crescentRef.current && isVisible) {
      const moonElement = moonRef.current;
      const crescentElement = crescentRef.current;
      
      // Position: 50% + sun offset + moon offset
      moonElement.style.left = `calc(50% + ${currentFrame.moon.x}vw)`;
      moonElement.style.top = `${currentFrame.moon.y}%`;
      
      // Scale and opacity
      moonElement.style.transform = `translate(-50%, -50%) scale(${currentFrame.moon.scale})`;
      moonElement.style.opacity = currentFrame.moon.opacity.toString();
      
      // Crescent phase effect
      const phasePercentage = currentFrame.moon.phase * 100;
      crescentElement.style.clipPath = `circle(50% at ${phasePercentage}% 50%)`;
    }
  }, [currentFrame, isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={moonRef}
      className="fixed pointer-events-none z-10"
      style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#E8E8E8',
        boxShadow: '0 0 15px rgba(232, 232, 232, 0.3)',
        transition: 'all 0.3s ease-out',
      }}
    >
      {/* Crescent shadow overlay */}
      <div
        ref={crescentRef}
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: '#2A2A2A',
          clipPath: 'circle(50% at 30% 50%)',
          transition: 'all 0.3s ease-out',
        }}
      />
    </div>
  );
};