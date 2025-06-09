
import React, { useMemo } from 'react';
import { Environment } from '@react-three/drei';
import { useHDRILoader } from './hooks/useHDRILoader';
import type { EnvironmentScene } from '../types';

interface HDRIEnvironmentRendererProps {
  scene: EnvironmentScene;
  intensity?: number;
  enableCaching?: boolean;
  onLoadingChange?: (isLoading: boolean) => void;
  onError?: (error: string) => void;
}

export const HDRIEnvironmentRenderer: React.FC<HDRIEnvironmentRendererProps> = ({
  scene,
  intensity = 1.0,
  enableCaching = true,
  onLoadingChange,
  onError
}) => {
  // Load HDRI with fallback to panoramic image
  const { texture, isLoading, error, fallbackTexture } = useHDRILoader({
    hdriUrl: scene.hdriUrl,
    fallbackUrl: scene.panoramicUrl || scene.backgroundImage,
    intensity,
    enableCaching
  });

  // Notify parent of loading state changes
  React.useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  // Notify parent of errors
  React.useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  // Determine which texture to use
  const environmentTexture = useMemo(() => {
    if (texture) return texture;
    if (fallbackTexture) return fallbackTexture;
    return null;
  }, [texture, fallbackTexture]);

  // Determine environment type based on available texture
  const environmentType = useMemo(() => {
    if (texture) return 'texture'; // HDRI texture
    if (fallbackTexture) return 'texture'; // Fallback panoramic
    if (scene.panoramicUrl || scene.backgroundImage) return scene.panoramicUrl || scene.backgroundImage;
    return 'studio'; // Default Three.js environment
  }, [texture, fallbackTexture, scene]);

  if (!environmentTexture && (scene.panoramicUrl || scene.backgroundImage)) {
    // Use URL-based environment for panoramic images
    return (
      <Environment
        files={scene.panoramicUrl || scene.backgroundImage}
        background
        blur={0}
        environmentIntensity={intensity}
      />
    );
  }

  if (environmentTexture) {
    // Use texture-based environment for HDRI or loaded panoramic
    return (
      <Environment
        map={environmentTexture}
        background
        blur={0}
        environmentIntensity={intensity}
      />
    );
  }

  // Fallback to preset environment
  return (
    <Environment
      preset="studio"
      background
      blur={0}
      environmentIntensity={intensity}
    />
  );
};
