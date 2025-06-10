
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { localImageCache } from './LocalImageCache';

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
  const { gl, scene } = useThree();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  console.log('🌍 ReliableSpaceEnvironment loading:', imageId);

  // Memoize texture loader to prevent recreating
  const textureLoader = useMemo(() => new TextureLoader(), []);

  useEffect(() => {
    let isMounted = true;
    
    const loadEnvironmentTexture = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        console.log('🔄 Loading environment texture:', imageId);
        
        // Load image through cache
        const image = await localImageCache.loadImage(imageId);
        
        if (!isMounted) return;
        
        // Create texture from cached image
        const newTexture = textureLoader.load(
          image.src,
          (loadedTexture) => {
            if (!isMounted) return;
            
            console.log('✅ Environment texture loaded:', imageId);
            
            // Configure for 360° panoramic mapping
            loadedTexture.mapping = THREE.EquirectangularReflectionMapping;
            loadedTexture.wrapS = THREE.RepeatWrapping;
            loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
            loadedTexture.flipY = false;
            
            // Enhanced filtering
            loadedTexture.magFilter = THREE.LinearFilter;
            loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
            loadedTexture.generateMipmaps = true;
            loadedTexture.colorSpace = THREE.SRGBColorSpace;
            
            setTexture(loadedTexture);
            setIsLoading(false);
            setHasError(false);
            onLoadComplete?.();
          },
          undefined,
          (error) => {
            if (!isMounted) return;
            console.error('❌ Texture creation failed:', error);
            setHasError(true);
            setIsLoading(false);
            onLoadError?.(error);
          }
        );
        
      } catch (error) {
        if (!isMounted) return;
        console.error('❌ Environment loading failed:', error);
        setHasError(true);
        setIsLoading(false);
        onLoadError?.(error as Error);
      }
    };

    loadEnvironmentTexture();
    
    return () => {
      isMounted = false;
      if (texture) {
        texture.dispose();
      }
    };
  }, [imageId, textureLoader, onLoadComplete, onLoadError]);

  // Apply texture to scene when ready
  useEffect(() => {
    if (!texture || hasError) {
      // Create procedural fallback only when there's an actual error
      if (hasError) {
        console.warn('⚠️ Creating procedural fallback environment');
        
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d')!;
        
        // Create sophisticated gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#2a2a3a');
        gradient.addColorStop(0.3, '#1a1a2e');
        gradient.addColorStop(0.7, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1024, 512);
        
        // Add subtle stars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let i = 0; i < 80; i++) {
          const x = Math.random() * 1024;
          const y = Math.random() * 512;
          const size = Math.random() * 1.5;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        const fallbackTexture = new THREE.CanvasTexture(canvas);
        fallbackTexture.mapping = THREE.EquirectangularReflectionMapping;
        
        // REMOVE background color completely - let texture handle it
        scene.background = fallbackTexture;
        scene.environment = fallbackTexture;
      }
      return;
    }

    console.log('🎨 Applying environment texture to scene');
    
    // CRITICAL: Remove any existing background color to prevent conflicts
    if (gl.domElement.style.backgroundColor) {
      gl.domElement.style.backgroundColor = '';
    }
    
    // Apply texture as both background and environment
    scene.background = texture;
    scene.environment = texture;
    
    // Configure tone mapping
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = exposure;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    
    console.log('✨ Environment applied successfully');
    
    return () => {
      // Clean up when component unmounts or texture changes
      if (scene.environment === texture) {
        scene.environment = null;
      }
      if (scene.background === texture) {
        scene.background = null;
      }
    };
  }, [texture, scene, gl, exposure, hasError]);

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

  return (
    <>
      {/* Optimized lighting for card illumination */}
      <ambientLight intensity={0.4 * brightness} />
      
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
      
      <directionalLight
        position={[-10, 10, -10]}
        intensity={0.3 * brightness}
        color="#ffffff"
      />
      
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
