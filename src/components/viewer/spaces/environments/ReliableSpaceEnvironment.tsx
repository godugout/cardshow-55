
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
  console.log('🎪 ReliableSpaceEnvironment using imageId:', imageId);
  
  return (
    <OptimizedPanoramicEnvironment
      imageUrl={imageId}
      rotation={rotation}
      exposure={exposure}
      brightness={brightness}
      onLoadComplete={onLoadComplete}
      onLoadError={onLoadError}
    />
  );
};
