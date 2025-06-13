
import React from 'react';
import { OptimizedPanoramicEnvironment } from './OptimizedPanoramicEnvironment';

interface ReliableSpaceEnvironmentProps {
  imageId: string;
  rotation?: number;
  exposure?: number;
  brightness?: number;
  onLoadComplete?: () => void;
  onLoadError?: (error: Error) => void;
}

export const ReliableSpaceEnvironment: React.FC<ReliableSpaceEnvironmentProps> = ({ 
  imageId,
  rotation = 0,
  exposure = 1.0,
  brightness = 1.0,
  onLoadComplete,
  onLoadError
}) => {
  console.log('🎪 ReliableSpaceEnvironment rendering with imageId:', imageId);
  
  // Enhanced debugging
  const handleLoadStart = () => {
    console.log('🔄 Environment loading started for:', imageId);
  };
  
  const handleLoadComplete = () => {
    console.log('✅ Environment loaded successfully for:', imageId);
    onLoadComplete?.();
  };
  
  const handleLoadError = (error: Error) => {
    console.error('❌ Environment load failed for:', imageId, error);
    onLoadError?.(error);
  };
  
  return (
    <OptimizedPanoramicEnvironment
      imageUrl={imageId}
      rotation={rotation}
      exposure={exposure}
      brightness={brightness}
      onLoadStart={handleLoadStart}
      onLoadComplete={handleLoadComplete}
      onLoadError={handleLoadError}
    />
  );
};
