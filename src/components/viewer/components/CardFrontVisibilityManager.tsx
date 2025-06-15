
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

export const CardFrontVisibilityManager: React.FC<CardFrontVisibilityManagerProps> = ({
  rotation,
  children,
  solidCardTransition = false,
}) => {
  const getVisibility = (): CardFrontVisibilityData => {
    const normalizedY = ((rotation.y % 360) + 360) % 360;
    const normalizedX = ((rotation.x % 360) + 360) % 360;

    if (solidCardTransition) {
      // For solid transitions, show front when Y rotation is in front range
      const isFrontVisibleY = normalizedY <= 90 || normalizedY >= 270;
      
      return {
        opacity: isFrontVisibleY ? 1 : 0,
        zIndex: isFrontVisibleY ? 25 : 5,
      };
    }
    
    // Simplified logic: front is visible when Y rotation is in front range
    // This ensures the card is always visible
    const isFrontVisible = normalizedY <= 90 || normalizedY >= 270;
    
    console.log('🔄 Card Front - Rotation X:', normalizedX.toFixed(1), 'Y:', normalizedY.toFixed(1), 'Visible:', isFrontVisible);
    
    return { 
      opacity: isFrontVisible ? 1 : 0,
      zIndex: isFrontVisible ? 25 : 15,
    };
  };

  const visibilityData = getVisibility();
  
  return <>{children(visibilityData)}</>;
};
