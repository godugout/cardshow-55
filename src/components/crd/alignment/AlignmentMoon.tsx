import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import * as THREE from 'three';

interface AlignmentMoonProps {
  progress: number;
  isVisible: boolean;
  isAnimationComplete?: boolean;
}

interface MoonFrame {
  progress: number;
  moon: {
    x: number; // Screen percentage relative to center
    y: number; // Screen position in pixels from top
    scale: number;
    opacity: number;
    phase: number; // 0-1 crescent phase
  };
}

// Simplified moon animation - comes down from above hero text
const MOON_FRAMES: MoonFrame[] = [
  {
    progress: 0,
    moon: { x: 0, y: 80, scale: 0.2, opacity: 0.4, phase: 0.15 } // Start above hero text
  },
  {
    progress: 0.5,
    moon: { x: 0, y: 100, scale: 0.35, opacity: 0.7, phase: 0.12 }
  },
  {
    progress: 1.0,
    moon: { x: 0, y: 120, scale: 0.5, opacity: 0.9, phase: 0.1 } // End at final position
  }
];

export const AlignmentMoon: React.FC<AlignmentMoonProps> = React.memo(({
  progress,
  isVisible,
  isAnimationComplete = false
}) => {
  const moonRef = useRef<HTMLDivElement>(null);
  const crescentRef = useRef<HTMLDivElement>(null);

  // Get current moon frame based on progress
  const getCurrentMoonFrame = useCallback((progress: number): MoonFrame => {
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
  }, []);

  // Current frame - if animation is complete, use final position
  const currentFrame = useMemo(() => {
    return isAnimationComplete 
      ? MOON_FRAMES[MOON_FRAMES.length - 1]
      : getCurrentMoonFrame(progress);
  }, [progress, isAnimationComplete, getCurrentMoonFrame]);

  // Update moon position and style
  useEffect(() => {
    if (!moonRef.current || !crescentRef.current) return;

    const frame = currentFrame.moon;
    
    // Position moon
    moonRef.current.style.left = `${50 + frame.x}%`;
    moonRef.current.style.top = `${frame.y}px`;
    moonRef.current.style.transform = `translate(-50%, -50%) scale(${frame.scale})`;
    moonRef.current.style.opacity = isVisible ? frame.opacity.toString() : '0';

    // Update crescent shape
    const phaseOffset = frame.phase * 100;
    crescentRef.current.style.clipPath = `inset(0 ${phaseOffset}% 0 0)`;
    
  }, [currentFrame, isVisible]);

  return (
    <div
      ref={moonRef}
      className="fixed pointer-events-none transition-opacity duration-1000"
      style={{
        width: '60px',
        height: '60px',
        zIndex: 45,
      }}
    >
      {/* Moon crescent */}
      <div
        ref={crescentRef}
        className="w-full h-full rounded-full border-2 border-white/80"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)',
        }}
      />
    </div>
  );
});

AlignmentMoon.displayName = 'AlignmentMoon';