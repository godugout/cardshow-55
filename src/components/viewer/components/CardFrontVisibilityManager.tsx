
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
  return opacity;
};

export const CardFrontVisibilityManager: React.FC<CardFrontVisibilityManagerProps> = ({
  rotation,
  children,
  solidCardTransition = false,
}) => {
  const getVisibility = (): CardFrontVisibilityData => {
    const normalizedY = ((rotation.y % 360) + 360) % 360;
    const normalizedX = ((rotation.x % 360) + 360) % 360;

    const isStrictlyFrontVisible = (normalizedY <= 90 || normalizedY >= 270) && (normalizedX <= 90 || normalizedX >= 270);

    if (solidCardTransition) {
      return {
        opacity: isStrictlyFrontVisible ? 1 : 0,
        zIndex: isStrictlyFrontVisible ? 25 : 5,
      };
    }
    
    const opacityY = getAxisFrontOpacity(normalizedY);
    const opacityX = getAxisFrontOpacity(normalizedX);
    
    // Final opacity is the minimum of opacities from each axis.
    // This ensures the front fades out if either axis turns away.
    const opacity = Math.min(opacityY, opacityX);

    console.log('🔄 Card Front - Rotation X:', normalizedX.toFixed(1), 'Y:', normalizedY.toFixed(1), 'Opacity:', opacity.toFixed(2));
    
    return { 
      opacity: Math.max(0, opacity),
      zIndex: opacity > 0.3 ? 25 : 15,
    };
  };

  const visibilityData = getVisibility();
  
  return <>{children(visibilityData)}</>;
};

