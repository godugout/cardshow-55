
import React from 'react';
import { OptimizedPanoramicEnvironment } from './OptimizedPanoramicEnvironment';
import { useImageSelection } from './hooks/useImageSelection';
import { useLoadingState } from './hooks/useLoadingState';
import { calculateExposure } from './utils/exposureCalculator';
import type { SpaceEnvironment, SpaceControls } from '../types';

interface ReliablePanoramicSpaceProps {
  config: SpaceEnvironment['config'];
  controls: SpaceControls;
}

export const ReliablePanoramicSpace: React.FC<ReliablePanoramicSpaceProps> = ({ 
  config, 
  controls 
}) => {
  console.log('🎪 ReliablePanoramicSpace config:', config);
  
  const imageConfig = useImageSelection({ 
    panoramicPhotoId: config.panoramicPhotoId 
  });
  
  const {
    isLoading,
    loadError,
    handleLoadStart,
    handleLoadComplete,
    handleLoadError
  } = useLoadingState();

  const finalExposure = calculateExposure({ config, imageConfig });

  return (
    <OptimizedPanoramicEnvironment
      imageUrl={imageConfig.localUrl}
      fallbackUrl={imageConfig.fallbackUrl}
      rotation={config.autoRotation || 0}
      exposure={finalExposure}
      saturation={config.saturation || 1.0}
      brightness={imageConfig.lighting.intensity}
      onLoadStart={handleLoadStart}
      onLoadComplete={handleLoadComplete}
      onLoadError={handleLoadError}
    />
  );
};
