
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { imageCacheManager } from './ImageCacheManager';

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
  const { gl, scene } = useThree();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  
  console.log('🌍 OptimizedPanoramicEnvironment loading:', imageUrl);

  useEffect(() => {
    let isMounted = true;
    
    const loadImageTexture = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        onLoadStart?.();
        
        console.log('🔄 Loading 360° image:', imageUrl);
        
        // Load image through cache manager
        const image = await imageCacheManager.loadImage(imageUrl, fallbackUrl);
        
        if (!isMounted) return;
        
        // Create texture from cached image
        const loader = new TextureLoader();
        const newTexture = loader.load(
          image.src,
          (loadedTexture) => {
            if (!isMounted) return;
            
            console.log('✅ 360° texture created successfully');
            
            // Configure texture for 360° panoramic mapping
            loadedTexture.mapping = THREE.EquirectangularReflectionMapping;
            loadedTexture.wrapS = THREE.RepeatWrapping;
            loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
            loadedTexture.flipY = false; // Important for proper orientation
            
            // Enhanced filtering
            loadedTexture.magFilter = THREE.LinearFilter;
            loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
            loadedTexture.generateMipmaps = true;
            
            // Color space
            loadedTexture.colorSpace = THREE.SRGBColorSpace;
            
            setTexture(loadedTexture);
            setIsLoading(false);
            onLoadComplete?.();
          },
          undefined,
          (error) => {
            if (!isMounted) return;
            console.error('❌ Failed to create texture:', error);
            const textureError = new Error('Failed to create 360° texture');
            setLoadError(textureError);
            setIsLoading(false);
            onLoadError?.(textureError);
          }
        );
        
        // Immediate texture assignment for faster rendering
        if (isMounted) {
          setTexture(newTexture);
        }
        
      } catch (error) {
        if (!isMounted) return;
        console.error('❌ Image loading failed:', error);
        setLoadError(error as Error);
        setIsLoading(false);
        onLoadError?.(error as Error);
      }
    };

    loadImageTexture();
    
    return () => {
      isMounted = false;
    };
  }, [imageUrl, fallbackUrl, onLoadStart, onLoadComplete, onLoadError]);

  useEffect(() => {
    if (!texture || loadError) {
      // Enhanced fallback with gradient
      console.warn('⚠️ Using enhanced gradient fallback');
      
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      
      // Create sophisticated gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, '#1a1a2e');   // Dark blue top
      gradient.addColorStop(0.3, '#16213e'); // Mid blue
      gradient.addColorStop(0.7, '#0f3460'); // Deep blue
      gradient.addColorStop(1, '#533483');   // Purple bottom
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 512);
      
      // Add some stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const size = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      const fallbackTexture = new THREE.CanvasTexture(canvas);
      fallbackTexture.mapping = THREE.EquirectangularReflectionMapping;
      
      scene.environment = fallbackTexture;
      scene.background = fallbackTexture;
      
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = exposure;
      
      return;
    }

    // Apply loaded texture
    scene.environment = texture;
    scene.background = texture;
    
    // Configure tone mapping
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = exposure;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    
    console.log('✨ 360° environment configured successfully');
    
    return () => {
      if (scene.environment === texture) {
        scene.environment = null;
      }
      if (scene.background === texture) {
        scene.background = null;
      }
    };
  }, [texture, scene, gl, exposure, loadError]);

  useFrame(() => {
    if (sphereRef.current && rotation !== 0) {
      sphereRef.current.rotation.y += rotation * 0.001;
    }
  });

  // Loading indicator
  if (isLoading) {
    return (
      <>
        <color attach="background" args={['#1a1a2e']} />
        <ambientLight intensity={0.6 * brightness} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.8 * brightness}
          castShadow
        />
        {/* Animated loading indicator */}
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[0.8, 1, 32]} />
          <meshBasicMaterial color="#4CAF50" transparent opacity={0.6} />
        </mesh>
      </>
    );
  }

  return (
    <>
      {/* Optimized lighting for card illumination */}
      <ambientLight intensity={0.4 * brightness} />
      
      {/* Primary directional light */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.8 * brightness}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Secondary fill light */}
      <directionalLight
        position={[-10, 10, -10]}
        intensity={0.3 * brightness}
        color="#ffffff"
      />
      
      {/* Rim lighting */}
      <pointLight
        position={[15, 0, 15]}
        intensity={0.2 * brightness}
        distance={50}
      />
      <pointLight
        position={[-15, 0, -15]}
        intensity={0.2 * brightness}
        distance={50}
      />
    </>
  );
};
