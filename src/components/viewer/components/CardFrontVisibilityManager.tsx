
import React from 'react';

interface CardFrontVisibilityData {
  opacity: number;
  zIndex: number;
}

interface CardFrontVisibilityManagerProps {
  rotation: { x: number; y: number };
  children: (visibilityData: CardFrontVisibilityData) => React.ReactNode;
  solidCardTransition?: boolean;
}

const getAxisFrontOpacity = (normalizedRotation: number): number => {
  const fadeRange = 30;
  // Front should be visible when rotation is 0° to 90° or 270° to 360°
  const isFrontVisible = normalizedRotation <= 90 || normalizedRotation >= 270;
  if (!isFrontVisible) return 0;

  let opacity = 1;
  // Fading out from 60° to 90°
  if (normalizedRotation > 90 - fadeRange && normalizedRotation <= 90) {
    opacity = (90 - normalizedRotation) / fadeRange;
  }
  // Fading in from 270° to 300°
  else if (normalizedRotation >= 270 && normalizedRotation < 270 + fadeRange) {
    opacity = (normalizedRotation - 270) / fadeRange;
  }
  return Math.max(0, Math.min(1, opacity));
};

export const CardFrontVisibilityManager: React.FC<CardFrontVisibilityManagerProps> = ({
  rotation,
  children,
  solidCardTransition = false,
}) => {
  const getVisibility = (): CardFrontVisibilityData => {
    const normalizedY = ((rotation.y % 360) + 360) % 360;
    const normalizedX = ((rotation.x % 360) + 360) % 360;

    if (solidCardTransition) {
      // For solid transitions, show front when both axes are in front range
      const isFrontVisibleY = normalizedY <= 90 || normalizedY >= 270;
      const isFrontVisibleX = normalizedX <= 90 || normalizedX >= 270;
      const isStrictlyFrontVisible = isFrontVisibleY && isFrontVisibleX;
      
      return {
        opacity: isStrictlyFrontVisible ? 1 : 0,
        zIndex: isStrictlyFrontVisible ? 25 : 5,
      };
    }
    
    const opacityY = getAxisFrontOpacity(normalizedY);
    const opacityX = getAxisFrontOpacity(normalizedX);
    
    // Use minimum opacity - front only shows when both axes are showing front
    const opacity = Math.min(opacityY, opacityX);

    console.log('🔄 Card Front - Rotation X:', normalizedX.toFixed(1), 'Y:', normalizedY.toFixed(1), 'Opacity:', opacity.toFixed(2));
    
    // Safety fallback: ensure at least one face is always visible
    // If back would be invisible (Y rotation 0-90 or 270-360), ensure front is visible
    const backWouldBeVisible = normalizedY > 90 && normalizedY < 270;
    const minVisibleOpacity = backWouldBeVisible ? 0 : 0.1;
    const adjustedOpacity = Math.max(minVisibleOpacity, opacity);
    
    return { 
      opacity: adjustedOpacity,
      zIndex: adjustedOpacity > 0.3 ? 25 : 15,
    };
  };

  const visibilityData = getVisibility();
  
  return <>{children(visibilityData)}</>;
};
