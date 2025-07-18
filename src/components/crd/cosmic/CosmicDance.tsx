import React, { useState, useEffect, useRef } from 'react';
import { CosmicMoon } from './CosmicMoon';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CosmicDanceProps {
  animationProgress: number; // 0 to 1 from the timeline slider
  isPlaying: boolean;
  cardAngle: number; // Current card forward lean angle
  cameraDistance: number; // Camera distance for zoom tracking
  isOptimalZoom: boolean; // Whether camera is at optimal zoom
  isOptimalPosition: boolean; // Whether card is centered
  onTriggerReached?: () => void; // Called when all conditions are met
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
  environment: {
    skyColor: string; // Gradient sky color
    spaceDepth: number; // Deep space feeling
  };
}

// Enhanced animation keyframes inspired by 2001: A Space Odyssey - Perfect Alignment
const ANIMATION_FRAMES: AnimationFrame[] = [
  // Dawn scene - Sun starts lower, below subtitle text
  {
    progress: 0,
    sun: { x: 0, y: 30, scale: 0.4, opacity: 0.8 },
    card: { lean: 0 },
    lighting: { intensity: 0.8, warmth: 0 },
    environment: { skyColor: '#0a0a2e', spaceDepth: 1.0 }
  },
  // Early descent - Sun moves toward center, continuing downward
  {
    progress: 0.25,
    sun: { x: 0, y: 40, scale: 0.7, opacity: 0.95 },
    card: { lean: 20 },
    lighting: { intensity: 1.0, warmth: 0.2 },
    environment: { skyColor: '#1a1a3e', spaceDepth: 0.9 }
  },
  // CRITICAL TRIGGER - Sun reaches center, perfect alignment
  {
    progress: 0.5,
    sun: { x: 0, y: 50, scale: 1.0, opacity: 1.0 },
    card: { lean: 45 },
    lighting: { intensity: 1.3, warmth: 0.5 },
    environment: { skyColor: '#2a1a1e', spaceDepth: 0.7 }
  },
  // Eternal alignment - Sun stays at center position
  {
    progress: 0.75,
    sun: { x: 0, y: 50, scale: 1.6, opacity: 1.0 },
    card: { lean: 65 },
    lighting: { intensity: 1.6, warmth: 0.8 },
    environment: { skyColor: '#3a0a0e', spaceDepth: 0.4 }
  },
  // TRANSCENDENCE - Sun massive at center alignment (2001 finale)
  {
    progress: 1.0,
    sun: { x: 0, y: 50, scale: 2.2, opacity: 1.0 },
    card: { lean: 80 },
    lighting: { intensity: 2.0, warmth: 1.0 },
    environment: { skyColor: '#4a0000', spaceDepth: 0.2 }
  }
];

export const CosmicDance: React.FC<CosmicDanceProps> = ({
  animationProgress,
  isPlaying,
  cardAngle,
  cameraDistance,
  isOptimalZoom,
  isOptimalPosition,
  onTriggerReached
}) => {
  const [hasTriggered, setHasTriggered] = useState(false);
  const sunRef = useRef<HTMLDivElement>(null);
  
  // Check for trigger point - ALL conditions must be met
  useEffect(() => {
    const isReadyForAlignment = cardAngle >= 45 && isOptimalZoom && isOptimalPosition;
    
    if (isReadyForAlignment && !hasTriggered) {
      setHasTriggered(true);
      onTriggerReached?.();
    } else if (cardAngle < 40 || !isOptimalZoom || !isOptimalPosition) {
      setHasTriggered(false);
    }
  }, [cardAngle, isOptimalZoom, isOptimalPosition, hasTriggered, onTriggerReached]);

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
      },
      environment: {
        skyColor: prevFrame.environment.skyColor, // Use discrete color changes for now
        spaceDepth: THREE.MathUtils.lerp(prevFrame.environment.spaceDepth, nextFrame.environment.spaceDepth, t),
      }
    };
  };

  const currentFrame = getCurrentFrame(animationProgress);

  // Enhanced cosmic environment effects
  useEffect(() => {
    // Apply environment effects to document body for full immersion
    const body = document.body;
    const skyColor = currentFrame.environment.skyColor;
    const spaceDepth = currentFrame.environment.spaceDepth;
    
    // Subtle background color shift for cosmic atmosphere
    body.style.background = `radial-gradient(circle at center, ${skyColor} 0%, #000000 100%)`;
    
    return () => {
      // Cleanup on unmount
      body.style.background = '';
    };
  }, [currentFrame]);

  // Update sun position with enhanced cinematic effects
  useEffect(() => {
    if (sunRef.current) {
      const sunElement = sunRef.current;
      
      // Enhanced positioning for perfect vertical alignment (2001 style)
      sunElement.style.left = `calc(50% + ${currentFrame.sun.x}vw)`;
      sunElement.style.top = `${currentFrame.sun.y}%`;
      
      // Enhanced scale and opacity with cinematic glow
      const baseScale = currentFrame.sun.scale;
      const glowIntensity = currentFrame.lighting.intensity;
      sunElement.style.transform = `translate(-50%, -50%) scale(${baseScale})`;
      sunElement.style.opacity = currentFrame.sun.opacity.toString();
      
      // Enhanced color warmth with cosmic evolution
      const warmth = currentFrame.lighting.warmth;
      const orangeIntensity = Math.round(255 - (warmth * 40)); // More dramatic shift
      const redIntensity = Math.round(255 - (warmth * 10));
      const blueComponent = Math.round(warmth * 20); // Add subtle blue for space effect
      
      sunElement.style.backgroundColor = `rgb(${redIntensity}, ${orangeIntensity}, ${blueComponent})`;
      
      // Cinematic glow effect - larger and more dramatic
      const glowSize = 30 + (warmth * 60) + (glowIntensity * 20);
      const glowOpacity = 0.2 + (warmth * 0.6);
      sunElement.style.boxShadow = `
        0 0 ${glowSize}px rgba(255, ${orangeIntensity}, ${blueComponent}, ${glowOpacity}),
        0 0 ${glowSize * 2}px rgba(255, ${orangeIntensity}, 0, ${glowOpacity * 0.5})
      `;
    }
  }, [currentFrame]);

  return (
    <>
      {/* Enhanced 2D Sun with Cinematic Glow - Behind card */}
      <div
        ref={sunRef}
        className="fixed pointer-events-none z-10"
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: '#FFA500',
          boxShadow: '0 0 30px rgba(255, 165, 0, 0.4)',
          transition: isPlaying ? 'all 0.1s ease-out' : 'all 0.5s ease-out',
          filter: `brightness(${1 + currentFrame.lighting.intensity * 0.3})`,
        }}
      />
      
      {/* Cosmic Moon - 2001 Style Crescent - Behind card, positioned between quote and card top */}
      <CosmicMoon
        progress={animationProgress}
        isVisible={animationProgress > 0.1}
      />
    </>
  );
};