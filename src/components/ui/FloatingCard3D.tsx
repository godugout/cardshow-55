import React from 'react';
import { CRDViewer } from '@/components/crd/CRDViewer';

// Legacy wrapper that maintains exact same API and functionality
export const FloatingCard3D: React.FC = () => {
  return (
    <CRDViewer
      mode="frozen" // Starts in frozen mode
      intensity={1}
      lightingPreset="studio"
      pathTheme="neutral"
      autoRotate={false}
      enableControls={true}
      enableGlassCase={true}
      showModeText={true}
      className="w-full h-screen"
    />
  );
};