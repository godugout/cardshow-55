
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
  // Updated visibility calculation accounting for rotateY(180deg) on back face
  const getVisibility = (): CardBackVisibilityData => {
    // Normalize rotation to 0-360 range
    const normalizedRotation = ((rotation.y % 360) + 360) % 360;
    
    // With rotateY(180deg) applied to back face, it's flipped
    // Back face should be visible when we're looking at the "back side" of the card
    // This means when rotation is between 90° and 270°
    const isBackVisible = normalizedRotation >= 90 && normalizedRotation <= 270;
    
    // Enhanced debug logging
    console.log('🔄 Card Back (Fixed) - Rotation:', normalizedRotation.toFixed(1), 'Visible:', isBackVisible);
    
    if (!isBackVisible) {
      return { opacity: 0, zIndex: 5, display: 'none' };
    }
    
    // Calculate smooth opacity transitions with longer fade ranges
    let opacity = 1;
    const fadeRange = 30; // 30 degrees for smoother transitions
    
    if (normalizedRotation >= 90 && normalizedRotation <= 90 + fadeRange) {
      // Fade in from 90° to 120°
      opacity = (normalizedRotation - 90) / fadeRange;
      console.log('🔄 Card Back (Fixed) - Fade in:', opacity.toFixed(2));
    } else if (normalizedRotation >= 270 - fadeRange && normalizedRotation <= 270) {
      // Fade out from 240° to 270°
      opacity = (270 - normalizedRotation) / fadeRange;
      console.log('🔄 Card Back (Fixed) - Fade out:', opacity.toFixed(2));
    } else {
      // Full visibility in the middle range (120° to 240°)
      opacity = 1;
      console.log('🔄 Card Back (Fixed) - Full visibility');
    }
    
    return { 
      opacity: Math.max(0.1, opacity),
      zIndex: opacity > 0.3 ? 25 : 15, // Higher z-index when more visible
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
