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
      enableInteractiveControls={true} // Enable full interactive controls for 3D sections
      enableGlassCase={true}
      showModeText={false}
      className="w-full h-full"
      isPaused={isPaused}
      onTogglePause={onTogglePause}
      showPauseButton={showPauseButton}
    />
  );
};