
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
  // Simplified: always show the front face, let CSS handle the 3D flip
  const visibilityData: CardFrontVisibilityData = {
    opacity: 1,
    zIndex: 10,
  };
  
  return <>{children(visibilityData)}</>;
};
