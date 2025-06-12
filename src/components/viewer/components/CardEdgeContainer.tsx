
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
  // Improved edge visibility calculation for new 3D positioning
  const getEdgeVisibility = () => {
    const normalizedRotation = ((rotation.y % 360) + 360) % 360;
    
    // Edge is most visible when card is sideways (around 90° and 270°)
    // Show edges when card is between 45°-135° or 225°-315°
    const isRightEdgeVisible = normalizedRotation >= 45 && normalizedRotation <= 135;
    const isLeftEdgeVisible = normalizedRotation >= 225 && normalizedRotation <= 315;
    
    console.log('🔄 Edge Visibility (Fixed) - Rotation:', normalizedRotation.toFixed(1), 'Right:', isRightEdgeVisible, 'Left:', isLeftEdgeVisible);
    
    if (!isRightEdgeVisible && !isLeftEdgeVisible) {
      return { opacity: 0, display: 'none' as const };
    }
    
    // Calculate opacity based on angle - most visible at 90° and 270°
    let opacity = 0;
    
    if (isRightEdgeVisible) {
      // Peak visibility at 90°
      const angleFromPeak = Math.abs(normalizedRotation - 90);
      opacity = Math.max(0, 1 - (angleFromPeak / 45));
    } else if (isLeftEdgeVisible) {
      // Peak visibility at 270°
      const angleFromPeak = Math.abs(normalizedRotation - 270);
      opacity = Math.max(0, 1 - (angleFromPeak / 45));
    }
    
    return { 
      opacity: Math.max(0.1, opacity), 
      display: 'block' as const
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
      holographic: 'linear-gradient(45deg, rgba(255, 107, 107, 0.8), rgba(78, 205, 196, 0.8), rgba(69, 183, 209, 0.8), rgba(150, 206, 180, 0.8))',
      gold: 'rgba(255, 215, 0, 0.8)',
      chrome: 'rgba(174, 182, 191, 0.7)',
      crystal: 'rgba(255, 255, 255, 0.6)',
      prizm: 'linear-gradient(45deg, rgba(255, 60, 60, 0.7), rgba(255, 120, 40, 0.7), rgba(255, 200, 40, 0.7), rgba(120, 255, 60, 0.7))',
      vintage: 'rgba(188, 170, 164, 0.6)',
      ice: 'rgba(14, 165, 233, 0.7)',
      aurora: 'linear-gradient(45deg, rgba(138, 43, 226, 0.7), rgba(20, 184, 166, 0.7), rgba(59, 130, 246, 0.7))',
      interference: 'rgba(156, 163, 175, 0.6)',
      foilspray: 'rgba(243, 156, 18, 0.7)'
    };
    
    return colorMap[dominantEffect[0]] || 'rgba(100, 150, 255, 0.6)';
  };

  const { opacity, display } = getEdgeVisibility();
  
  if (display === 'none') {
    return null;
  }

  const gasColor = getGasColor();
  const intensity = isHovering && interactiveLighting ? 1.3 : 1;
  const edgeThickness = 8; // 8px gap between front and back faces

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        transition: 'opacity 0.3s ease',
        display,
        // Position as a proper side face between front and back
        transform: 'rotateY(90deg) translateZ(0px)',
        transformStyle: 'preserve-3d',
        width: `${edgeThickness}px`,
        height: '100%',
        left: '50%',
        marginLeft: `-${edgeThickness / 2}px`, // Center the edge
        transformOrigin: 'center center',
        backfaceVisibility: 'hidden'
      }}
      data-edge-visibility={opacity > 0.1 ? 'visible' : 'hidden'}
      data-edge-rotation={rotation.y.toFixed(1)}
    >
      {/* Main edge surface with proper 3D positioning */}
      <div
        className="absolute inset-0"
        style={{
          width: '100%',
          height: '100%',
          background: gasColor,
          boxShadow: `
            0 0 ${edgeThickness * 2}px ${gasColor},
            inset 0 0 ${edgeThickness}px rgba(255, 255, 255, 0.2)
          `,
          filter: `brightness(${intensity}) blur(0.5px)`,
          borderRadius: '2px'
        }}
      />
      
      {/* Glowing gas layers extending outward */}
      <div
        className="absolute inset-0"
        style={{
          width: `${edgeThickness * 3}px`,
          height: '100%',
          left: `-${edgeThickness}px`, // Extend beyond the edge surface
          background: `radial-gradient(ellipse, ${gasColor} 0%, transparent 70%)`,
          animation: isHovering ? 'gas-pulse 2s ease-in-out infinite alternate' : 'gas-gentle 4s ease-in-out infinite alternate',
          filter: `brightness(${intensity * 0.8})`
        }}
      />
      
      {/* Particle-like sparkles for magical effects */}
      {(effectValues.holographic?.intensity as number > 20 || 
        effectValues.crystal?.intensity as number > 20 ||
        effectValues.prizm?.intensity as number > 20) && (
        <div
          className="absolute inset-0"
          style={{
            width: `${edgeThickness * 2}px`,
            height: '100%',
            left: `-${edgeThickness / 2}px`,
            background: `
              radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.8) 1px, transparent 2px),
              radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.6) 1px, transparent 2px),
              radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.7) 1px, transparent 2px)
            `,
            animation: 'sparkle-dance 3s ease-in-out infinite',
            filter: `brightness(${intensity})`
          }}
        />
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
    </div>
  );
};
