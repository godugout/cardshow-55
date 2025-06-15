
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

export const CardBackVisibilityManager: React.FC<CardBackVisibilityManagerProps> = ({
  rotation,
  children,
  solidCardTransition = false,
}) => {
  const getVisibility = (): CardBackVisibilityData => {
    // Normalize rotations to 0-360 range
    const normalizedY = ((rotation.y % 360) + 360) % 360;
    const normalizedX = ((rotation.x % 360) + 360) % 360;
    
    if (solidCardTransition) {
      // For solid transitions, show back when Y rotation is in back range
      const isBackVisibleY = normalizedY > 90 && normalizedY < 270;
      
      return {
        opacity: isBackVisibleY ? 1 : 0,
        zIndex: isBackVisibleY ? 25 : 5,
      };
    }
    
    // Simplified logic: back is visible when Y rotation is in back range
    // This ensures the card is always visible
    const isBackVisible = normalizedY > 90 && normalizedY < 270;
    
    console.log('🔄 Card Back - Rotation X:', normalizedX.toFixed(1), 'Y:', normalizedY.toFixed(1), 'Visible:', isBackVisible);
    
    return { 
      opacity: isBackVisible ? 1 : 0,
      zIndex: isBackVisible ? 25 : 15,
    };
  };

  const visibilityData = getVisibility();
  
  return <>{children(visibilityData)}</>;
};
