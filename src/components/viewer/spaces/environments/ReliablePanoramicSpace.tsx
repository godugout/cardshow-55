
import React, { useState } from 'react';
import { OptimizedPanoramicEnvironment } from './OptimizedPanoramicEnvironment';
import { getLocal360ImageById, getDefaultLocal360Image } from './LocalImageLibrary';
import type { SpaceEnvironment, SpaceControls } from '../types';

interface ReliablePanoramicSpaceProps {
  config: SpaceEnvironment['config'];
  controls: SpaceControls;
}

export const ReliablePanoramicSpace: React.FC<ReliablePanoramicSpaceProps> = ({ 
  config, 
  controls 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  
  console.log('🎪 ReliablePanoramicSpace config:', config);
  
  // Get image configuration
  let imageConfig = null;
  
  if (config.panoramicPhotoId) {
    imageConfig = getLocal360ImageById(config.panoramicPhotoId);
    if (imageConfig) {
      console.log('📸 Using configured image:', imageConfig.name);
    }
  }
  
  // Use default if no specific image found
  if (!imageConfig) {
    console.warn('⚠️ No specific image found, using default');
    imageConfig = getDefaultLocal360Image();
  }
  
  console.log('🖼️ Final image selection:', {
    name: imageConfig.name,
    localUrl: imageConfig.localUrl,
    fallbackUrl: imageConfig.fallbackUrl
  });

  const handleLoadStart = () => {
    console.log('🔄 360° image loading started');
    setIsLoading(true);
    setLoadError(null);
  };

  const handleLoadComplete = () => {
    console.log('✅ 360° image loading completed');
    setIsLoading(false);
    setLoadError(null);
  };

  const handleLoadError = (error: Error) => {
    console.error('❌ 360° image loading failed:', error);
    setIsLoading(false);
    setLoadError(error);
  };

  // Enhanced exposure calculation
  const baseExposure = config.exposure || imageConfig.lighting.intensity;
  const finalExposure = Math.max(0.5, Math.min(3.0, baseExposure * 1.2));

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
