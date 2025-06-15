import React from 'react';

interface CardBackVisibilityData {
  opacity: number;
  zIndex: number;
}

interface CardBackVisibilityManagerProps {
  rotation: { x: number; y: number };
  children: (visibilityData: CardBackVisibilityData) => React.ReactNode;
  solidCardTransition?: boolean;
}

const getAxisBackOpacity = (normalizedRotation: number): number => {
  const fadeRange = 30;
  const isBackVisible = normalizedRotation >= 90 && normalizedRotation <= 270;
  if (!isBackVisible) return 0;

  let opacity = 1;
  // Fade in from 90° to 120°
  if (normalizedRotation >= 90 && normalizedRotation <= 90 + fadeRange) {
    opacity = (normalizedRotation - 90) / fadeRange;
  } 
  // Fade out from 240° to 270°
  else if (normalizedRotation >= 270 - fadeRange && normalizedRotation <= 270) {
    opacity = (270 - normalizedRotation) / fadeRange;
  }
  return opacity;
};


export const CardBackVisibilityManager: React.FC<CardBackVisibilityManagerProps> = ({
  rotation,
  children,
  solidCardTransition = false,
}) => {
  // Visibility calculation for both X and Y axes
  const getVisibility = (): CardBackVisibilityData => {
    // Normalize rotations to 0-360 range
    const normalizedY = ((rotation.y % 360) + 360) % 360;
    const normalizedX = ((rotation.x % 360) + 360) % 360;
    
    const isBackVisibleOnY = normalizedY >= 90 && normalizedY <= 270;
    const isBackVisibleOnX = normalizedX >= 90 && normalizedX <= 270;
    const isBackVisible = isBackVisibleOnY || isBackVisibleOnX;

    if (solidCardTransition) {
      return {
        opacity: isBackVisible ? 1 : 0,
        zIndex: isBackVisible ? 25 : 5,
      };
    }
    
    const opacityY = getAxisBackOpacity(normalizedY);
    const opacityX = getAxisBackOpacity(normalizedX);
    
    // Final opacity is the maximum of the two axes.
    // This ensures the back is shown if either axis is flipped.
    const opacity = Math.max(opacityY, opacityX);
    
    console.log('🔄 Card Back - Rotation X:', normalizedX.toFixed(1), 'Y:', normalizedY.toFixed(1), 'Opacity:', opacity.toFixed(2));
    
    return { 
      opacity: Math.max(0, opacity),
      zIndex: opacity > 0.3 ? 25 : 15, // Higher z-index when more visible
    };
  };

  const visibilityData = getVisibility();
  
  return <>{children(visibilityData)}</>;
};
