
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
  // Simplified: always show the back face, let CSS handle the 3D flip
  const visibilityData: CardBackVisibilityData = {
    opacity: 1,
    zIndex: 5,
  };
  
  return <>{children(visibilityData)}</>;
};
