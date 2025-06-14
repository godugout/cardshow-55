
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useImageLoader } from './hooks/useImageLoader';
import { usePanoramicTexture } from './hooks/usePanoramicTexture';
import { PanoramicLighting } from './components/PanoramicLighting';
import { PanoramicLoadingIndicator } from './components/PanoramicLoadingIndicator';

interface OptimizedPanoramicEnvironmentProps {
  imageUrl: string;
  fallbackUrl?: string;
  rotation?: number;
  exposure?: number;
  saturation?: number;
  brightness?: number;
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
  onLoadError?: (error: Error) => void;
}

export const OptimizedPanoramicEnvironment: React.FC<OptimizedPanoramicEnvironmentProps> = ({
  imageUrl,
  fallbackUrl,
  rotation = 0,
  exposure = 1.0,
  saturation = 1.0,
  brightness = 1.0,
  onLoadStart,
  onLoadComplete,
  onLoadError
}) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  console.log('🌍 OptimizedPanoramicEnvironment loading:', imageUrl);

  const { image, isLoading, loadError } = useImageLoader({
    imageUrl,
    fallbackUrl,
    onLoadStart,
    onLoadComplete,
    onLoadError
  });

  const { texture } = usePanoramicTexture({
    image,
    loadError,
    isLoading,
    exposure
  });

  useFrame(() => {
    if (sphereRef.current && rotation !== 0) {
      sphereRef.current.rotation.y += rotation * 0.001;
    }
  });

  // Only show loading indicators while actually loading
  if (isLoading && !texture) {
    return <PanoramicLoadingIndicator brightness={brightness} />;
  }

  return <PanoramicLighting brightness={brightness} />;
};
