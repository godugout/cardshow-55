import React, { useState, useEffect, useRef } from 'react';
import { CosmicMoon } from './CosmicMoon';
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
  environment: {
    skyColor: string; // Gradient sky color
    spaceDepth: number; // Deep space feeling
  };
}

// Enhanced animation keyframes inspired by 2001: A Space Odyssey
const ANIMATION_FRAMES: AnimationFrame[] = [
  // Dawn scene - Monolith emerging
  {
    progress: 0,
    sun: { x: 0, y: 15, scale: 0.4, opacity: 0.7 },
    card: { lean: 0 },
    lighting: { intensity: 0.8, warmth: 0 },
    environment: { skyColor: '#0a0a2e', spaceDepth: 1.0 }
  },
  // Early alignment - Cosmic awakening
  {
    progress: 0.25,
    sun: { x: 0, y: 30, scale: 0.6, opacity: 0.85 },
    card: { lean: 20 },
    lighting: { intensity: 1.0, warmth: 0.3 },
    environment: { skyColor: '#1a1a3e', spaceDepth: 0.8 }
  },
  // CRITICAL TRIGGER - 45° monolith lean (symbolic enlightenment moment)
  {
    progress: 0.5,
    sun: { x: 0, y: 50, scale: 0.9, opacity: 1.0 },
    card: { lean: 45 },
    lighting: { intensity: 1.4, warmth: 0.6 },
    environment: { skyColor: '#2a1a1e', spaceDepth: 0.6 }
  },
  // Deep alignment - Cosmic convergence
  {
    progress: 0.75,
    sun: { x: 0, y: 70, scale: 1.3, opacity: 0.95 },
    card: { lean: 65 },
    lighting: { intensity: 1.7, warmth: 0.85 },
    environment: { skyColor: '#3a0a0e', spaceDepth: 0.4 }
  },
  // FINAL ALIGNMENT - Sun behind monolith (transcendence)
  {
    progress: 1.0,
    sun: { x: 0, y: 85, scale: 1.8, opacity: 0.8 },
    card: { lean: 80 },
    lighting: { intensity: 2.0, warmth: 1.0 },
    environment: { skyColor: '#4a0000', spaceDepth: 0.2 }
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
      {/* Enhanced 2D Sun with Cinematic Glow */}
      <div
        ref={sunRef}
        className="fixed pointer-events-none z-30"
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
      
      {/* Cosmic Moon - 2001 Style Crescent */}
      <CosmicMoon
        progress={animationProgress}
        isVisible={animationProgress > 0.1}
      />
      
      {/* Enhanced Cosmic Trigger Notification */}
      {hasTriggered && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
          <div className="bg-gradient-to-r from-orange-500/90 to-red-500/90 backdrop-blur-sm rounded-xl px-6 py-3 text-white font-medium animate-pulse border border-orange-300/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              🌌 COSMIC ALIGNMENT INITIATED
            </div>
            <div className="text-xs opacity-80 mt-1">
              "My God, it's full of stars..."
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced Frame Debug with Cinematic Info */}
      <div className="fixed top-4 right-4 z-40 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-xs space-y-1 border border-white/10">
          <div className="text-orange-300 font-semibold">COSMIC DANCE - Frame Data</div>
          <div>Progress: {Math.round(animationProgress * 100)}%</div>
          <div>Monolith Lean: {Math.round(cardAngle)}°</div>
          <div>Sun Position: {Math.round(currentFrame.sun.y)}%</div>
          <div>Solar Scale: {currentFrame.sun.scale.toFixed(1)}x</div>
          <div>Light Intensity: {currentFrame.lighting.intensity.toFixed(1)}x</div>
          <div>Cosmic Warmth: {Math.round(currentFrame.lighting.warmth * 100)}%</div>
          <div className={`${hasTriggered ? 'text-green-400' : 'text-gray-400'}`}>
            Status: {hasTriggered ? 'ALIGNED' : 'MANUAL'}
          </div>
        </div>
      </div>
    </>
  );
};