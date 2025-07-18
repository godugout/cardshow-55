
import React from 'react';
import { CRDViewer } from '@/components/crd/CRDViewer';

interface FloatingCard3DProps {
  isPaused?: boolean;
  onTogglePause?: () => void;
  showPauseButton?: boolean;
}

// Legacy wrapper that maintains exact same API and functionality
export const FloatingCard3D: React.FC<FloatingCard3DProps> = ({ 
  isPaused, 
  onTogglePause,
  showPauseButton = false 
}) => {
  return (
    <CRDViewer
      mode="monolith" // Starts in monolith mode
      intensity={1}
      lightingPreset="studio"
      pathTheme="neutral"
      autoRotate={false}
      enableControls={true}
      enableGlassCase={true}
      showModeText={false}
      hideCosmicControls={true} // Disable cosmic controls completely
      className="w-full h-screen"
      isPaused={isPaused}
      onTogglePause={onTogglePause}
      showPauseButton={showPauseButton}
    />
  );
};
