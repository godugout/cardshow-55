
import React from 'react';
import { CRDViewer } from '@/components/crd/CRDViewer';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';

interface FloatingCard3DProps {
  isPaused?: boolean;
  onTogglePause?: () => void;
  showPauseButton?: boolean;
}

export const FloatingCard3D: React.FC<FloatingCard3DProps> = ({ 
  isPaused, 
  onTogglePause,
  showPauseButton = false 
}) => {
  const { deviceType, isShortScreen } = useResponsiveBreakpoints();

  // Adjust intensity and quality based on device type
  const getDeviceConfig = () => {
    switch (deviceType) {
      case 'mobile':
        return { intensity: 0.7, autoRotate: true, enableControls: false };
      case 'tablet':
        return { intensity: 0.8, autoRotate: false, enableControls: true };
      case 'large-desktop':
        return { intensity: 1.2, autoRotate: false, enableControls: true };
      default:
        return { intensity: 1, autoRotate: false, enableControls: true };
    }
  };

  const deviceConfig = getDeviceConfig();

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <CRDViewer
        mode="monolith"
        intensity={deviceConfig.intensity}
        lightingPreset="studio"
        pathTheme="neutral"
        autoRotate={deviceConfig.autoRotate}
        enableControls={deviceConfig.enableControls}
        enableGlassCase={true}
        showModeText={false}
        hideCosmicControls={true}
        className="w-full h-full"
        isPaused={isPaused}
        onTogglePause={onTogglePause}
        showPauseButton={showPauseButton}
      />
    </div>
  );
};
