
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
  
  console.log('🌍 PanoramicEnvironment loading:', photoUrl);
  
  // Determine if this is an HDR file or regular image
  const isHDR = photoUrl.includes('.hdr') || photoUrl.includes('.exr');
  
  // Load texture based on file type
  const texture = useLoader(
    isHDR ? RGBELoader : TextureLoader,
    photoUrl,
    (loader) => {
      console.log('🔄 Texture loader ready for:', photoUrl);
      setIsLoading(true);
      
      if (isHDR && loader instanceof RGBELoader) {
        // Configure HDR loader
        loader.setDataType(THREE.FloatType);
      }
      
      // Add error handling
      loader.manager.onError = (url) => {
        console.error('❌ Failed to load panoramic texture:', url);
        setLoadError(true);
        setIsLoading(false);
      };
      
      loader.manager.onLoad = () => {
        console.log('✅ Panoramic texture loaded successfully');
        setIsLoading(false);
        setLoadError(false);
      };
    }
  );
  
  useEffect(() => {
    if (!texture || loadError) {
      console.warn('⚠️ Texture failed to load, using fallback environment');
      
      // Fallback to gradient background
      scene.background = new THREE.Color(0x1a1a1a);
      scene.environment = null;
      
      // Configure basic tone mapping
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = exposure;
      
      return;
    }

    try {
      console.log('🎨 Configuring panoramic texture...');
      
      // Configure texture for panoramic use
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.flipY = false;
      
      // Set as environment map and background
      scene.environment = texture;
      scene.background = texture;
      
      // Configure tone mapping for realistic exposure
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = exposure;
      
      console.log('✨ Panoramic environment configured successfully');
      
    } catch (error) {
      console.error('💥 Error configuring panoramic environment:', error);
      setLoadError(true);
    }
    
    return () => {
      // Cleanup
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

  // If there's an error or still loading, show fallback
  if (loadError || isLoading) {
    return (
      <>
        <color attach="background" args={['#1a1a1a']} />
        <ambientLight intensity={0.4 * brightness} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.6 * brightness}
          castShadow
        />
        {isLoading && (
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        )}
      </>
    );
  }

  return (
    <>
      {/* Invisible sphere for environment mapping (backup rendering) */}
      <mesh ref={sphereRef} scale={[-100, 100, 100]} visible={false}>
        <sphereGeometry args={[1, 64, 32]} />
        <meshBasicMaterial
          map={texture}
          side={THREE.BackSide}
          transparent={false}
        />
      </mesh>
      
      {/* Enhanced lighting for card illumination */}
      <ambientLight intensity={0.4 * brightness} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.6 * brightness}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3 * brightness}
        color="#ffffff"
      />
      
      {/* Subtle fill lights for even card illumination */}
      <pointLight
        position={[10, 0, 10]}
        intensity={0.2 * brightness}
        color="#ffffff"
      />
      <pointLight
        position={[-10, 0, -10]}
        intensity={0.2 * brightness}
        color="#ffffff"
      />
    </>
  );
};
