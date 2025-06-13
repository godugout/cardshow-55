
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { enhancedImageLoader } from './EnhancedImageLoader';
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
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  
  console.log('🌍 OptimizedPanoramicEnvironment loading:', imageUrl);

  useEffect(() => {
    let isMounted = true;
    
    const loadTexture = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        onLoadStart?.();
        
        console.log('🔄 Loading optimized panoramic texture:', imageUrl);
        
        // Use enhanced image loader with proper quality settings
        const optimizedTexture = await enhancedImageLoader.loadOptimizedTexture(imageUrl, {
          baseSize: { width: 1024, height: 512 }, // Reduced from 2048x1024
          highQualitySize: { width: 1536, height: 768 }, // Moderate high quality
          compressionQuality: 0.85
        });
        
        if (!isMounted) return;
        
        // Apply additional settings
        optimizedTexture.colorSpace = THREE.SRGBColorSpace;
        
        console.log('✅ Optimized panoramic texture loaded successfully');
        setTexture(optimizedTexture);
        setIsLoading(false);
        setLoadError(null);
        onLoadComplete?.();
        
      } catch (error) {
        if (!isMounted) return;
        console.error('❌ Panoramic texture loading failed:', error);
        setLoadError(error as Error);
        setIsLoading(false);
        onLoadError?.(error as Error);
      }
    };

    loadTexture();
    
    return () => {
      isMounted = false;
      if (texture) {
        texture.dispose();
      }
    };
  }, [imageUrl, fallbackUrl, onLoadStart, onLoadComplete, onLoadError]);

  useFrame(() => {
    if (sphereRef.current && rotation !== 0) {
      sphereRef.current.rotation.y += rotation * 0.001;
    }
  });

  // Show loading indicator while loading
  if (isLoading && !texture) {
    return <PanoramicLoadingIndicator brightness={brightness} />;
  }

  return (
    <>
      {/* Environment Sphere with optimized texture */}
      {texture && (
        <mesh ref={sphereRef} scale={[-1, 1, 1]}>
          <sphereGeometry args={[500, 60, 40]} />
          <meshBasicMaterial 
            map={texture}
            toneMapped={false}
            transparent={false}
          />
        </mesh>
      )}
      
      {/* Lighting */}
      <PanoramicLighting brightness={brightness} />
    </>
  );
};
