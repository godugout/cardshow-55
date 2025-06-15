
import React from 'react';

interface CardBackVisibilityData {
  opacity: number;
  zIndex: number;
  display: 'block' | 'none';
}

interface CardBackVisibilityManagerProps {
  rotation: { x: number; y: number };
  children: (visibilityData: CardBackVisibilityData) => React.ReactNode;
}

export const CardBackVisibilityManager: React.FC<CardBackVisibilityManagerProps> = ({
  rotation,
  children
}) => {
  // Improved visibility calculation with better angle ranges
  const getVisibility = (): CardBackVisibilityData => {
    // Normalize rotation to 0-360 range
    const normalizedRotation = ((rotation.y % 360) + 360) % 360;
    
    // Back is visible from 90° to 270° (back side of card)
    const isBackVisible = normalizedRotation >= 90 && normalizedRotation <= 270;
    
    console.log('🔄 Card Back - Rotation:', normalizedRotation.toFixed(1), 'Visible:', isBackVisible);
    
    if (!isBackVisible) {
      return { opacity: 0, zIndex: 5, display: 'none' };
    }
    
    // Calculate smooth opacity transitions
    let opacity = 1;
    const fadeRange = 20; // Degrees for fade transition
    
    if (normalizedRotation >= 90 && normalizedRotation <= 90 + fadeRange) {
      // Fade in from 90° to 110°
      opacity = (normalizedRotation - 90) / fadeRange;
    } else if (normalizedRotation >= 270 - fadeRange && normalizedRotation <= 270) {
      // Fade out from 250° to 270°
      opacity = (270 - normalizedRotation) / fadeRange;
    }
    
    return { 
      opacity: Math.max(0.1, opacity),
      zIndex: opacity > 0.5 ? 25 : 15,
      display: 'block'
    };
  };

  const visibilityData = getVisibility();
  
  // Don't render at all if not visible
  if (visibilityData.display === 'none') {
    return null;
  }

  return <>{children(visibilityData)}</>;
};
