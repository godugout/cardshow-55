import React from 'react';
import { CRDViewer } from '@/components/crd/CRDViewer';

// Legacy wrapper that maintains exact same API and functionality
export const FloatingCard3D: React.FC = () => {
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
      className="w-full h-screen"
    />
  );
};