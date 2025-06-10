
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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
  const { scene, gl } = useThree();
  
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

  // Create the panoramic sphere geometry
  useEffect(() => {
    if (texture && sphereRef.current) {
      // Apply texture to sphere material
      const material = sphereRef.current.material as THREE.MeshBasicMaterial;
      material.map = texture;
      material.needsUpdate = true;
      
      // Configure tone mapping
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = exposure;
      
      console.log('✅ Panoramic environment texture applied');
    }
  }, [texture, exposure, gl]);

  useFrame(() => {
    if (sphereRef.current && rotation !== 0) {
      sphereRef.current.rotation.y += rotation * 0.001;
    }
  });

  // Show loading indicators while actually loading
  if (isLoading && !texture) {
    return <PanoramicLoadingIndicator brightness={brightness} />;
  }

  return (
    <>
      {/* Panoramic Sphere */}
      <mesh ref={sphereRef} scale={[-500, 500, 500]}>
        <sphereGeometry args={[1, 64, 32]} />
        <meshBasicMaterial 
          side={THREE.BackSide}
          transparent={false}
          opacity={1}
        />
      </mesh>
      
      {/* Lighting */}
      <PanoramicLighting brightness={brightness} />
    </>
  );
};
