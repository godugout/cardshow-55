import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CosmicDanceProps {
  animationProgress: number; // 0 to 1 from the timeline slider
  isPlaying: boolean;
  cardAngle: number; // Current card forward lean angle
  onTriggerReached?: () => void; // Called when card reaches 45°
}

interface AnimationFrame {
  progress: number;
  sun: {
    x: number; // Screen percentage -50 to 50
    y: number; // Screen percentage 0 to 100 (0 = top, 100 = bottom)
    scale: number; // 0.5 to 2.0
    opacity: number; // 0 to 1
  };
  card: {
    lean: number; // Forward lean angle in degrees
  };
  lighting: {
    intensity: number; // 0.5 to 2.0
    warmth: number; // Color temperature adjustment
  };
}

// Define the animation keyframes
const ANIMATION_FRAMES: AnimationFrame[] = [
  // Start frame
  {
    progress: 0,
    sun: { x: 0, y: 20, scale: 0.6, opacity: 0.8 },
    card: { lean: 0 },
    lighting: { intensity: 1.0, warmth: 0 }
  },
  // Quarter way
  {
    progress: 0.25,
    sun: { x: 0, y: 35, scale: 0.8, opacity: 0.9 },
    card: { lean: 15 },
    lighting: { intensity: 1.1, warmth: 0.2 }
  },
  // Trigger point - card at 45°
  {
    progress: 0.5,
    sun: { x: 0, y: 50, scale: 1.0, opacity: 1.0 },
    card: { lean: 45 },
    lighting: { intensity: 1.3, warmth: 0.5 }
  },
  // Alignment beginning
  {
    progress: 0.75,
    sun: { x: 0, y: 65, scale: 1.4, opacity: 0.9 },
    card: { lean: 60 },
    lighting: { intensity: 1.5, warmth: 0.8 }
  },
  // Final alignment - sun almost hidden
  {
    progress: 1.0,
    sun: { x: 0, y: 80, scale: 1.8, opacity: 0.7 },
    card: { lean: 75 },
    lighting: { intensity: 1.8, warmth: 1.0 }
  }
];

export const CosmicDance: React.FC<CosmicDanceProps> = ({
  animationProgress,
  isPlaying,
  cardAngle,
  onTriggerReached
}) => {
  const [hasTriggered, setHasTriggered] = useState(false);
  const sunRef = useRef<HTMLDivElement>(null);
  
  // Check for trigger point
  useEffect(() => {
    if (cardAngle >= 45 && !hasTriggered) {
      setHasTriggered(true);
      onTriggerReached?.();
    } else if (cardAngle < 40) {
      setHasTriggered(false);
    }
  }, [cardAngle, hasTriggered, onTriggerReached]);

  // Interpolate between keyframes
  const getCurrentFrame = (progress: number): AnimationFrame => {
    if (progress <= 0) return ANIMATION_FRAMES[0];
    if (progress >= 1) return ANIMATION_FRAMES[ANIMATION_FRAMES.length - 1];

    // Find the two frames to interpolate between
    let nextFrameIndex = ANIMATION_FRAMES.findIndex(frame => frame.progress > progress);
    if (nextFrameIndex === -1) nextFrameIndex = ANIMATION_FRAMES.length - 1;
    
    const prevFrame = ANIMATION_FRAMES[nextFrameIndex - 1] || ANIMATION_FRAMES[0];
    const nextFrame = ANIMATION_FRAMES[nextFrameIndex];
    
    // Calculate interpolation factor
    const frameProgress = (progress - prevFrame.progress) / (nextFrame.progress - prevFrame.progress);
    const t = Math.max(0, Math.min(1, frameProgress));
    
    // Interpolate all values
    return {
      progress,
      sun: {
        x: THREE.MathUtils.lerp(prevFrame.sun.x, nextFrame.sun.x, t),
        y: THREE.MathUtils.lerp(prevFrame.sun.y, nextFrame.sun.y, t),
        scale: THREE.MathUtils.lerp(prevFrame.sun.scale, nextFrame.sun.scale, t),
        opacity: THREE.MathUtils.lerp(prevFrame.sun.opacity, nextFrame.sun.opacity, t),
      },
      card: {
        lean: THREE.MathUtils.lerp(prevFrame.card.lean, nextFrame.card.lean, t),
      },
      lighting: {
        intensity: THREE.MathUtils.lerp(prevFrame.lighting.intensity, nextFrame.lighting.intensity, t),
        warmth: THREE.MathUtils.lerp(prevFrame.lighting.warmth, nextFrame.lighting.warmth, t),
      }
    };
  };

  const currentFrame = getCurrentFrame(animationProgress);

  // Update sun position and appearance
  useEffect(() => {
    if (sunRef.current) {
      const sunElement = sunRef.current;
      
      // Position: 50% from left + x offset, y% from top
      sunElement.style.left = `calc(50% + ${currentFrame.sun.x}vw)`;
      sunElement.style.top = `${currentFrame.sun.y}%`;
      
      // Scale and opacity
      sunElement.style.transform = `translate(-50%, -50%) scale(${currentFrame.sun.scale})`;
      sunElement.style.opacity = currentFrame.sun.opacity.toString();
      
      // Color warmth effect
      const warmth = currentFrame.lighting.warmth;
      const orangeIntensity = Math.round(255 - (warmth * 55)); // 255 to 200
      const redIntensity = Math.round(255 - (warmth * 15)); // 255 to 240
      sunElement.style.backgroundColor = `rgb(${redIntensity}, ${orangeIntensity}, 0)`;
      sunElement.style.boxShadow = `0 0 ${20 + warmth * 30}px rgba(255, ${orangeIntensity}, 0, ${0.3 + warmth * 0.4})`;
    }
  }, [currentFrame]);

  return (
    <>
      {/* 2D Sun Overlay */}
      <div
        ref={sunRef}
        className="fixed pointer-events-none z-30"
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: '#FFA500',
          boxShadow: '0 0 20px rgba(255, 165, 0, 0.3)',
          transition: isPlaying ? 'all 0.1s ease-out' : 'all 0.3s ease-out',
        }}
      />
      
      {/* Trigger Indicator */}
      {hasTriggered && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
          <div className="bg-orange-500/90 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm font-medium animate-pulse">
            🌅 Cosmic Dance Activated
          </div>
        </div>
      )}
      
      {/* Debug Info */}
      <div className="fixed top-4 right-4 z-40 pointer-events-none">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-xs space-y-1">
          <div>Progress: {Math.round(animationProgress * 100)}%</div>
          <div>Card Angle: {Math.round(cardAngle)}°</div>
          <div>Sun Y: {Math.round(currentFrame.sun.y)}%</div>
          <div>Scale: {currentFrame.sun.scale.toFixed(1)}</div>
          <div>Triggered: {hasTriggered ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </>
  );
};