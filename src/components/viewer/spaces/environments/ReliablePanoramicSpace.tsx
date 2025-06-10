
import React from 'react';
import { SimplePanoramicEnvironment } from './SimplePanoramicEnvironment';
import { useImageSelection } from './hooks/useImageSelection';
import { useLoadingState } from './hooks/useLoadingState';
import { calculateExposure } from './utils/exposureCalculator';
import type { SpaceEnvironment, SpaceControls } from '../types';

interface ReliablePanoramicSpaceProps {
  config: SpaceEnvironment['config'];
  controls: SpaceControls;
  onError?: (error: Error) => void;
}

export const ReliablePanoramicSpace: React.FC<ReliablePanoramicSpaceProps> = ({ 
  config, 
  controls,
  onError
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

  const handleError = (error: Error) => {
    console.error('❌ ReliablePanoramicSpace error:', error);
    handleLoadError(error);
    onError?.(error);
  };

  if (loadError) {
    console.warn('⚠️ Panoramic space has loading error, using enhanced fallback');
    return (
      <>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={0.6} />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />
      </>
    );
  }

  return (
    <SimplePanoramicEnvironment
      imageUrl={imageConfig.localUrl}
      fallbackUrl={imageConfig.fallbackUrl}
      rotation={config.autoRotation || 0}
      exposure={finalExposure}
      saturation={config.saturation || 1.0}
      brightness={imageConfig.lighting.intensity}
      onLoadStart={handleLoadStart}
      onLoadComplete={handleLoadComplete}
      onLoadError={handleError}
    />
  );
};
