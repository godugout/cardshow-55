
import React from 'react';
import { useTextureLoader } from './hooks/useTextureLoader';
import { useSceneBackground } from './hooks/useSceneBackground';
import { EnvironmentLighting } from './components/EnvironmentLighting';

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
  console.log('🌍 ReliableSpaceEnvironment loading:', imageId);

  const { texture, isLoading, hasError } = useTextureLoader({
    imageId,
    onLoadComplete,
    onLoadError
  });

  useSceneBackground({
    texture,
    hasError,
    exposure
  });

  // Show minimal loading without interfering with background
  if (isLoading && !texture) {
    return (
      <>
        <ambientLight intensity={0.4 * brightness} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={0.6 * brightness}
          castShadow
        />
      </>
    );
  }

  return <EnvironmentLighting brightness={brightness} />;
};
