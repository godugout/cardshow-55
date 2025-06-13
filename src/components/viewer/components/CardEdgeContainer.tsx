
import React from 'react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface CardEdgeContainerProps {
  rotation: { x: number; y: number };
  isHovering: boolean;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  interactiveLighting?: boolean;
  zoom: number;
}

export const CardEdgeContainer: React.FC<CardEdgeContainerProps> = ({
  rotation,
  isHovering,
  effectValues,
  mousePosition,
  interactiveLighting = false,
  zoom
}) => {
  // Calculate edge visibility based on rotation angle
  const getEdgeVisibility = () => {
    const normalizedRotation = ((rotation.y % 360) + 360) % 360;
    
    // Determine which edges are visible based on rotation
    const rightEdgeVisible = normalizedRotation >= 45 && normalizedRotation <= 135;
    const leftEdgeVisible = normalizedRotation >= 225 && normalizedRotation <= 315;
    
    let rightOpacity = 0;
    let leftOpacity = 0;
    
    if (rightEdgeVisible) {
      // Peak visibility at 90° for right edge
      const angleFromPeak = Math.abs(normalizedRotation - 90);
      rightOpacity = Math.max(0, 1 - (angleFromPeak / 45));
    }
    
    if (leftEdgeVisible) {
      // Peak visibility at 270° for left edge
      const angleFromPeak = Math.abs(normalizedRotation - 270);
      leftOpacity = Math.max(0, 1 - (angleFromPeak / 45));
    }
    
    return { 
      rightOpacity: Math.max(0.1, rightOpacity),
      leftOpacity: Math.max(0.1, leftOpacity),
      isVisible: rightOpacity > 0.1 || leftOpacity > 0.1
    };
  };

  // Get gas color based on active effects
  const getGasColor = () => {
    const activeEffects = Object.entries(effectValues).filter(([_, effect]) => 
      effect.intensity && typeof effect.intensity === 'number' && effect.intensity > 10
    );
    
    if (activeEffects.length === 0) {
      return 'rgba(100, 150, 255, 0.6)'; // Default blue glow
    }
    
    // Use the dominant effect to determine gas color
    const dominantEffect = activeEffects.reduce((max, current) => 
      (current[1].intensity as number) > (max[1].intensity as number) ? current : max
    );
    
    const colorMap: Record<string, string> = {
      holographic: 'linear-gradient(90deg, rgba(255, 107, 107, 0.8), rgba(78, 205, 196, 0.8), rgba(69, 183, 209, 0.8), rgba(150, 206, 180, 0.8))',
      gold: 'rgba(255, 215, 0, 0.8)',
      chrome: 'rgba(174, 182, 191, 0.7)',
      crystal: 'rgba(255, 255, 255, 0.6)',
      prizm: 'linear-gradient(90deg, rgba(255, 60, 60, 0.7), rgba(255, 120, 40, 0.7), rgba(255, 200, 40, 0.7), rgba(120, 255, 60, 0.7))',
      vintage: 'rgba(188, 170, 164, 0.6)',
      ice: 'rgba(14, 165, 233, 0.7)',
      aurora: 'linear-gradient(90deg, rgba(138, 43, 226, 0.7), rgba(20, 184, 166, 0.7), rgba(59, 130, 246, 0.7))',
      interference: 'rgba(156, 163, 175, 0.6)',
      foilspray: 'rgba(243, 156, 18, 0.7)'
    };
    
    return colorMap[dominantEffect[0]] || 'rgba(100, 150, 255, 0.6)';
  };

  const { rightOpacity, leftOpacity, isVisible } = getEdgeVisibility();
  
  if (!isVisible) {
    return null;
  }

  const gasColor = getGasColor();
  const intensity = isHovering && interactiveLighting ? 1.3 : 1;
  const edgeThickness = Math.max(4, 8 * zoom); // Minimum thickness with zoom scaling

  return (
    <>
      {/* Right Edge Glow - Contained within card boundaries */}
      {rightOpacity > 0.1 && (
        <div 
          className="absolute top-0 h-full pointer-events-none z-15"
          style={{
            right: '0px', // Changed from '-8px' to stay within boundaries
            opacity: rightOpacity,
            transition: 'opacity 0.3s ease',
            width: `${edgeThickness}px`
          }}
          data-edge="right"
          data-opacity={rightOpacity.toFixed(2)}
        >
          {/* Inner glow using box-shadow instead of extending outside */}
          <div
            className="absolute top-0 right-0 h-full"
            style={{
              width: `${edgeThickness}px`,
              background: gasColor,
              boxShadow: `
                inset -2px 0 ${edgeThickness}px ${gasColor},
                inset 0 0 ${edgeThickness / 2}px rgba(255, 255, 255, 0.3)
              `,
              filter: `brightness(${intensity}) blur(0.5px)`,
              borderRadius: '0 2px 2px 0'
            }}
          />
          
          {/* Subtle outer glow within card bounds */}
          <div
            className="absolute top-0 right-0 h-full"
            style={{
              width: `${edgeThickness / 2}px`,
              background: `linear-gradient(to left, ${gasColor} 0%, transparent 100%)`,
              animation: isHovering ? 'gas-pulse 2s ease-in-out infinite alternate' : 'gas-gentle 4s ease-in-out infinite alternate',
              filter: `brightness(${intensity * 0.8})`
            }}
          />
        </div>
      )}

      {/* Left Edge Glow - Contained within card boundaries */}
      {leftOpacity > 0.1 && (
        <div 
          className="absolute top-0 h-full pointer-events-none z-15"
          style={{
            left: '0px', // Changed from '-8px' to stay within boundaries
            opacity: leftOpacity,
            transition: 'opacity 0.3s ease',
            width: `${edgeThickness}px`
          }}
          data-edge="left"
          data-opacity={leftOpacity.toFixed(2)}
        >
          {/* Inner glow using box-shadow instead of extending outside */}
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: `${edgeThickness}px`,
              background: gasColor,
              boxShadow: `
                inset 2px 0 ${edgeThickness}px ${gasColor},
                inset 0 0 ${edgeThickness / 2}px rgba(255, 255, 255, 0.3)
              `,
              filter: `brightness(${intensity}) blur(0.5px)`,
              borderRadius: '2px 0 0 2px'
            }}
          />
          
          {/* Subtle outer glow within card bounds */}
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: `${edgeThickness / 2}px`,
              background: `linear-gradient(to right, ${gasColor} 0%, transparent 100%)`,
              animation: isHovering ? 'gas-pulse 2s ease-in-out infinite alternate' : 'gas-gentle 4s ease-in-out infinite alternate',
              filter: `brightness(${intensity * 0.8})`
            }}
          />
        </div>
      )}
      
      {/* Enhanced sparkles for magical effects - contained within bounds */}
      {(effectValues.holographic?.intensity as number > 20 || 
        effectValues.crystal?.intensity as number > 20 ||
        effectValues.prizm?.intensity as number > 20) && (
        <>
          {rightOpacity > 0.1 && (
            <div
              className="absolute top-0 h-full pointer-events-none"
              style={{
                right: '2px', // Slightly inset from edge
                width: `${edgeThickness - 4}px`,
                background: `
                  radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.8) 1px, transparent 2px),
                  radial-gradient(circle at 50% 60%, rgba(255, 255, 255, 0.6) 1px, transparent 2px),
                  radial-gradient(circle at 50% 85%, rgba(255, 255, 255, 0.7) 1px, transparent 2px)
                `,
                animation: 'sparkle-dance 3s ease-in-out infinite',
                filter: `brightness(${intensity})`,
                opacity: rightOpacity
              }}
            />
          )}
          
          {leftOpacity > 0.1 && (
            <div
              className="absolute top-0 h-full pointer-events-none"
              style={{
                left: '2px', // Slightly inset from edge
                width: `${edgeThickness - 4}px`,
                background: `
                  radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.8) 1px, transparent 2px),
                  radial-gradient(circle at 50% 60%, rgba(255, 255, 255, 0.6) 1px, transparent 2px),
                  radial-gradient(circle at 50% 85%, rgba(255, 255, 255, 0.7) 1px, transparent 2px)
                `,
                animation: 'sparkle-dance 3s ease-in-out infinite',
                filter: `brightness(${intensity})`,
                opacity: leftOpacity
              }}
            />
          )}
        </>
      )}

      {/* CSS animations */}
      <style>
        {`
          @keyframes gas-pulse {
            0% { opacity: 0.6; transform: scaleY(1); }
            100% { opacity: 0.9; transform: scaleY(1.05); }
          }
          
          @keyframes gas-gentle {
            0% { opacity: 0.4; transform: scaleY(0.98); }
            100% { opacity: 0.7; transform: scaleY(1.02); }
          }
          
          @keyframes sparkle-dance {
            0% { opacity: 0.3; }
            50% { opacity: 0.8; }
            100% { opacity: 0.3; }
          }
        `}
      </style>
    </>
  );
};
