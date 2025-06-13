import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface Card3DThicknessProps {
  rotation: { x: number; y: number };
  isHovering: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  interactiveLighting?: boolean;
  zoom: number;
}

export const Card3DThickness: React.FC<Card3DThicknessProps> = ({
  rotation,
  isHovering,
  effectValues,
  mousePosition,
  interactiveLighting = false,
  zoom
}) => {
  // Calculate side wall visibility based on rotation angle
  const getSideWallVisibility = () => {
    const normalizedRotationY = ((rotation.y % 360) + 360) % 360;
    const normalizedRotationX = ((rotation.x % 360) + 360) % 360;
    
    // Enhanced debug logging
    console.log('🎯 Card3DThickness - Y Rotation:', normalizedRotationY.toFixed(1), 'X Rotation:', normalizedRotationX.toFixed(1));
    
    // Right wall visible when card shows right side (45° to 135°)
    const rightWallVisible = normalizedRotationY >= 45 && normalizedRotationY <= 135;
    const rightOpacity = rightWallVisible ? 
      Math.max(0.2, 1 - Math.abs(normalizedRotationY - 90) / 45) : 0;
    
    // Left wall visible when card shows left side (225° to 315°)
    const leftWallVisible = normalizedRotationY >= 225 && normalizedRotationY <= 315;
    const leftOpacity = leftWallVisible ? 
      Math.max(0.2, 1 - Math.abs(normalizedRotationY - 270) / 45) : 0;
    
    // Top/bottom walls for X rotation
    const topWallVisible = normalizedRotationX >= 315 || normalizedRotationX <= 45;
    const topOpacity = topWallVisible ? 
      Math.max(0.2, 1 - Math.min(normalizedRotationX, 360 - normalizedRotationX) / 45) : 0;
    
    const bottomWallVisible = normalizedRotationX >= 135 && normalizedRotationX <= 225;
    const bottomOpacity = bottomWallVisible ? 
      Math.max(0.2, 1 - Math.abs(normalizedRotationX - 180) / 45) : 0;
    
    const anyVisible = rightOpacity > 0.1 || leftOpacity > 0.1 || topOpacity > 0.1 || bottomOpacity > 0.1;
    
    console.log('🔥 Walls Visibility:', { rightOpacity: rightOpacity.toFixed(2), leftOpacity: leftOpacity.toFixed(2), anyVisible });
    
    return { 
      rightOpacity, 
      leftOpacity, 
      topOpacity, 
      bottomOpacity,
      anyVisible
    };
  };

  // Get gas color based on active effects
  const getGasColor = () => {
    const activeEffects = Object.entries(effectValues).filter(([_, effect]) => 
      effect.intensity && typeof effect.intensity === 'number' && effect.intensity > 10
    );
    
    if (activeEffects.length === 0) {
      return 'rgba(100, 150, 255, 0.8)'; // Default blue glow
    }
    
    const dominantEffect = activeEffects.reduce((max, current) => 
      (current[1].intensity as number) > (max[1].intensity as number) ? current : max
    );
    
    const colorMap: Record<string, string> = {
      holographic: 'rgba(255, 107, 107, 0.9)',
      gold: 'rgba(255, 215, 0, 0.9)',
      chrome: 'rgba(174, 182, 191, 0.8)',
      crystal: 'rgba(255, 255, 255, 0.8)',
      prizm: 'rgba(255, 60, 60, 0.8)',
      vintage: 'rgba(188, 170, 164, 0.7)',
      ice: 'rgba(14, 165, 233, 0.8)',
      aurora: 'rgba(138, 43, 226, 0.8)',
      interference: 'rgba(156, 163, 175, 0.7)',
      foilspray: 'rgba(243, 156, 18, 0.8)'
    };
    
    return colorMap[dominantEffect[0]] || 'rgba(100, 150, 255, 0.8)';
  };

  const { rightOpacity, leftOpacity, topOpacity, bottomOpacity, anyVisible } = getSideWallVisibility();
  
  if (!anyVisible) {
    console.log('❌ No walls visible, not rendering Card3DThickness');
    return null;
  }

  const gasColor = getGasColor();
  const intensity = isHovering && interactiveLighting ? 1.4 : 1.1;
  const thickness = 4; // 4px thick walls

  console.log('✅ Rendering Card3DThickness with walls:', { rightOpacity, leftOpacity, topOpacity, bottomOpacity });

  const wallStyle = {
    position: 'absolute' as const,
    width: '400px',
    height: '560px',
    transformStyle: 'preserve-3d' as const,
    pointerEvents: 'none' as const
  };

  const glowStyle = {
    width: '100%',
    height: '100%',
    background: gasColor,
    boxShadow: `
      0 0 ${thickness * 4}px ${gasColor},
      0 0 ${thickness * 8}px ${gasColor},
      inset 0 0 ${thickness}px rgba(255, 255, 255, 0.3)
    `,
    filter: `brightness(${intensity}) blur(1px)`,
    animation: isHovering ? 'gas-pulse-3d 2s ease-in-out infinite alternate' : 'gas-gentle-3d 4s ease-in-out infinite alternate'
  };

  return (
    <>
      {/* Right Side Wall */}
      {rightOpacity > 0.1 && (
        <div 
          className="absolute top-0 right-0 w-full h-full pointer-events-none z-20"
          style={{
            opacity: rightOpacity,
            transform: `translateX(200px) rotateY(90deg) translateZ(-2px)`,
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d'
          }}
          data-wall="right"
        >
          <div 
            style={{
              width: '4px',
              height: '100%',
              background: gasColor,
              boxShadow: `
                0 0 8px ${gasColor},
                0 0 16px ${gasColor},
                inset 0 0 2px rgba(255, 255, 255, 0.3)
              `,
              filter: `brightness(${intensity}) blur(1px)`,
              animation: isHovering ? 'gas-pulse-3d 2s ease-in-out infinite alternate' : 'gas-gentle-3d 4s ease-in-out infinite alternate'
            }}
          />
        </div>
      )}

      {/* Left Side Wall */}
      {leftOpacity > 0.1 && (
        <div 
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
          style={{
            opacity: leftOpacity,
            transform: `translateX(-200px) rotateY(-90deg) translateZ(-2px)`,
            transformOrigin: 'right center',
            transformStyle: 'preserve-3d'
          }}
          data-wall="left"
        >
          <div 
            style={{
              width: '4px',
              height: '100%',
              background: gasColor,
              boxShadow: `
                0 0 8px ${gasColor},
                0 0 16px ${gasColor},
                inset 0 0 2px rgba(255, 255, 255, 0.3)
              `,
              filter: `brightness(${intensity}) blur(1px)`,
              animation: isHovering ? 'gas-pulse-3d 2s ease-in-out infinite alternate' : 'gas-gentle-3d 4s ease-in-out infinite alternate'
            }}
          />
        </div>
      )}

      {/* Top Side Wall */}
      {topOpacity > 0.1 && (
        <div 
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
          style={{
            opacity: topOpacity,
            transform: `translateY(-280px) rotateX(90deg) translateZ(-2px)`,
            transformOrigin: 'center bottom',
            transformStyle: 'preserve-3d'
          }}
          data-wall="top"
        >
          <div 
            style={{
              width: '100%',
              height: '4px',
              background: gasColor,
              boxShadow: `
                0 0 8px ${gasColor},
                0 0 16px ${gasColor},
                inset 0 0 2px rgba(255, 255, 255, 0.3)
              `,
              filter: `brightness(${intensity}) blur(1px)`,
              animation: isHovering ? 'gas-pulse-3d 2s ease-in-out infinite alternate' : 'gas-gentle-3d 4s ease-in-out infinite alternate'
            }}
          />
        </div>
      )}

      {/* Bottom Side Wall */}
      {bottomOpacity > 0.1 && (
        <div 
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
          style={{
            opacity: bottomOpacity,
            transform: `translateY(280px) rotateX(-90deg) translateZ(-2px)`,
            transformOrigin: 'center top',
            transformStyle: 'preserve-3d'
          }}
          data-wall="bottom"
        >
          <div 
            style={{
              width: '100%',
              height: '4px',
              background: gasColor,
              boxShadow: `
                0 0 8px ${gasColor},
                0 0 16px ${gasColor},
                inset 0 0 2px rgba(255, 255, 255, 0.3)
              `,
              filter: `brightness(${intensity}) blur(1px)`,
              animation: isHovering ? 'gas-pulse-3d 2s ease-in-out infinite alternate' : 'gas-gentle-3d 4s ease-in-out infinite alternate'
            }}
          />
        </div>
      )}

      {/* CSS animations for 3D effects */}
      <style>
        {`
          @keyframes gas-pulse-3d {
            0% { 
              opacity: 0.7; 
              filter: brightness(${intensity}) blur(1px) drop-shadow(0 0 8px ${gasColor});
            }
            100% { 
              opacity: 1; 
              filter: brightness(${intensity * 1.2}) blur(0.5px) drop-shadow(0 0 16px ${gasColor});
            }
          }
          
          @keyframes gas-gentle-3d {
            0% { 
              opacity: 0.5; 
              filter: brightness(${intensity * 0.9}) blur(1px);
            }
            100% { 
              opacity: 0.8; 
              filter: brightness(${intensity}) blur(0.8px);
            }
          }
        `}
      </style>
    </>
  );
};
