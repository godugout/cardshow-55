
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface PanoramicEnvironmentProps {
  photoUrl: string;
  rotation?: number;
  exposure?: number;
  saturation?: number;
  brightness?: number;
}

export const PanoramicEnvironment: React.FC<PanoramicEnvironmentProps> = ({
  photoUrl,
  rotation = 0,
  exposure = 1.0,
  saturation = 1.0,
  brightness = 1.0
}) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const { gl, scene } = useThree();
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  
  console.log('🌍 PanoramicEnvironment loading:', photoUrl);
  
  // Determine if this is an HDR file or regular image
  const isHDR = photoUrl.includes('.hdr') || photoUrl.includes('.exr');
  
  // Enhanced texture loading with retry mechanism
  let texture;
  try {
    texture = useLoader(
      isHDR ? RGBELoader : TextureLoader,
      photoUrl,
      (loader) => {
        console.log('🔄 Texture loader configured for:', photoUrl);
        setIsLoading(true);
        
        if (isHDR && loader instanceof RGBELoader) {
          // Enhanced HDR loader configuration
          loader.setDataType(THREE.FloatType);
          loader.setPath('');
        }
        
        // Enhanced error handling with retry logic
        loader.manager.onError = (url) => {
          console.error('❌ Failed to load panoramic texture:', url);
          setLoadError(true);
          setIsLoading(false);
          
          // Implement retry mechanism
          if (retryCount < 2) {
            console.log('🔄 Retrying texture load, attempt:', retryCount + 1);
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
              setLoadError(false);
            }, 1000);
          }
        };
        
        loader.manager.onLoad = () => {
          console.log('✅ Panoramic texture loaded successfully');
          setIsLoading(false);
          setLoadError(false);
          setRetryCount(0);
        };
      }
    );
  } catch (error) {
    console.error('💥 Texture loading failed:', error);
    setLoadError(true);
    setIsLoading(false);
  }
  
  useEffect(() => {
    if (!texture || loadError) {
      console.warn('⚠️ Texture failed to load, using enhanced fallback environment');
      
      // Enhanced fallback with gradient background
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      
      // Create a gradient fallback
      const gradient = ctx.createLinearGradient(0, 0, 0, 256);
      gradient.addColorStop(0, '#87CEEB'); // Sky blue
      gradient.addColorStop(0.5, '#E0F6FF'); // Light blue
      gradient.addColorStop(1, '#98FB98'); // Light green
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 256);
      
      const fallbackTexture = new THREE.CanvasTexture(canvas);
      fallbackTexture.mapping = THREE.EquirectangularReflectionMapping;
      
      scene.environment = fallbackTexture;
      scene.background = fallbackTexture;
      
      // Configure tone mapping for fallback
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = exposure;
      
      return;
    }

    try {
      console.log('🎨 Configuring high-quality panoramic texture...');
      
      // Enhanced texture configuration for quality and proper orientation
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      
      // Fix upside-down issue: set flipY to true for proper HDR orientation
      texture.flipY = true;
      
      // Enhanced filtering for better quality
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.generateMipmaps = true;
      
      // Color space and encoding for HDR
      if (isHDR) {
        texture.colorSpace = THREE.LinearSRGBColorSpace;
        texture.type = THREE.FloatType;
      } else {
        texture.colorSpace = THREE.SRGBColorSpace;
      }
      
      // Set as environment map and background
      scene.environment = texture;
      scene.background = texture;
      
      // Enhanced tone mapping configuration
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = exposure;
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
      
      console.log('✨ High-quality panoramic environment configured successfully');
      
    } catch (error) {
      console.error('💥 Error configuring panoramic environment:', error);
      setLoadError(true);
    }
    
    return () => {
      // Enhanced cleanup
      if (scene.environment === texture) {
        scene.environment = null;
      }
      if (scene.background === texture) {
        scene.background = null;
      }
    };
  }, [texture, scene, gl, exposure, loadError, retryCount]);

  useFrame(() => {
    if (sphereRef.current && rotation !== 0) {
      sphereRef.current.rotation.y += rotation * 0.001;
    }
  });

  // Enhanced fallback with loading state
  if (loadError || isLoading) {
    return (
      <>
        <color attach="background" args={['#1a1a1a']} />
        <ambientLight intensity={0.6 * brightness} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.8 * brightness}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.4 * brightness}
          color="#ffffff"
        />
        {isLoading && (
          <mesh position={[0, 3, 0]}>
            <sphereGeometry args={[0.05, 8, 6]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        )}
        {loadError && retryCount >= 2 && (
          <mesh position={[0, -3, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color="#ff4444" />
          </mesh>
        )}
      </>
    );
  }

  return (
    <>
      {/* Enhanced invisible sphere for backup rendering */}
      <mesh 
        ref={sphereRef} 
        scale={[-1000, 1000, 1000]} 
        visible={false}
        rotation={[0, Math.PI, 0]} // Compensate for orientation
      >
        <sphereGeometry args={[1, 64, 32]} />
        <meshBasicMaterial
          map={texture}
          side={THREE.BackSide}
          transparent={false}
        />
      </mesh>
      
      {/* Enhanced lighting system for optimal card illumination */}
      <ambientLight intensity={0.5 * brightness} />
      
      {/* Primary directional light */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.8 * brightness}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Secondary directional light for fill */}
      <directionalLight
        position={[-10, 10, -10]}
        intensity={0.4 * brightness}
        color="#ffffff"
      />
      
      {/* Rim lighting for card definition */}
      <pointLight
        position={[15, 0, 15]}
        intensity={0.3 * brightness}
        color="#ffffff"
        distance={50}
      />
      <pointLight
        position={[-15, 0, -15]}
        intensity={0.3 * brightness}
        color="#ffffff"
        distance={50}
      />
      
      {/* Subtle ground lighting */}
      <pointLight
        position={[0, -10, 0]}
        intensity={0.2 * brightness}
        color="#ffffff"
        distance={30}
      />
    </>
  );
};
