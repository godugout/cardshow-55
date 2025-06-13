
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
          baseSize: { width: 1024, height: 512 },
          highQualitySize: { width: 1536, height: 768 },
          compressionQuality: 0.85
        });
        
        if (!isMounted) return;
        
        // Configure texture for panoramic mapping - FIXED
        optimizedTexture.mapping = THREE.EquirectangularReflectionMapping;
        optimizedTexture.wrapS = THREE.RepeatWrapping;
        optimizedTexture.wrapT = THREE.ClampToEdgeWrapping;
        optimizedTexture.flipY = false; // Critical for proper orientation
        optimizedTexture.colorSpace = THREE.SRGBColorSpace;
        
        console.log('✅ Optimized panoramic texture loaded and configured');
        setTexture(optimizedTexture);
        setIsLoading(false);
        setLoadError(null);
        onLoadComplete?.();
        
      } catch (error) {
        if (!isMounted) return;
        console.error('❌ Panoramic texture loading failed:', error);
        
        // Create fallback texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;
        
        const gradient = ctx.createLinearGradient(0, 0, 0, 256);
        gradient.addColorStop(0, '#2a2a2a');
        gradient.addColorStop(0.5, '#404040');
        gradient.addColorStop(1, '#1a1a1a');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 256);
        
        const fallbackTexture = new THREE.CanvasTexture(canvas);
        fallbackTexture.mapping = THREE.EquirectangularReflectionMapping;
        fallbackTexture.colorSpace = THREE.SRGBColorSpace;
        
        setTexture(fallbackTexture);
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
      {/* Environment Sphere with FIXED scale - much smaller for proper visibility */}
      {texture && (
        <mesh ref={sphereRef} scale={[-50, 50, 50]} position={[0, 0, 0]}>
          <sphereGeometry args={[1, 60, 40]} />
          <meshBasicMaterial 
            map={texture}
            side={THREE.BackSide}
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
