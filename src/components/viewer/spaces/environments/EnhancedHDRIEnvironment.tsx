
import React, { useRef, useEffect, Suspense, useState } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { Environment, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import type { HDRIEnvironment } from './HDRILibrary';

interface EnhancedHDRIEnvironmentProps {
  environment: HDRIEnvironment;
  onLoadComplete?: () => void;
  onLoadError?: (error: Error) => void;
}

const HDRITexture: React.FC<{ 
  environment: HDRIEnvironment; 
  onLoad?: () => void;
  onError?: (error: Error) => void;
}> = ({ environment, onLoad, onError }) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadHDRI = async () => {
      try {
        setIsLoading(true);
        console.log('🌍 Loading HDRI environment:', environment.hdriUrl);
        
        // Try to load HDRI first, fallback to regular image
        const loader = new THREE.TextureLoader();
        
        const loadedTexture = await new Promise<THREE.Texture>((resolve, reject) => {
          // First try HDRI URL
          loader.load(
            environment.hdriUrl,
            (hdriTexture) => {
              console.log('✅ HDRI loaded successfully');
              resolve(hdriTexture);
            },
            undefined,
            (hdriError) => {
              console.warn('⚠️ HDRI failed, trying fallback:', hdriError);
              // Fallback to regular image
              loader.load(
                environment.fallbackUrl,
                (fallbackTexture) => {
                  console.log('✅ Fallback texture loaded');
                  resolve(fallbackTexture);
                },
                undefined,
                (fallbackError) => {
                  console.error('❌ Both HDRI and fallback failed:', fallbackError);
                  reject(fallbackError);
                }
              );
            }
          );
        });
        
        // Configure texture for 360° mapping
        loadedTexture.mapping = THREE.EquirectangularReflectionMapping;
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
        loadedTexture.flipY = false;
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        
        // Enhanced filtering
        loadedTexture.magFilter = THREE.LinearFilter;
        loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
        loadedTexture.generateMipmaps = true;
        
        setTexture(loadedTexture);
        setIsLoading(false);
        onLoad?.();
        
      } catch (error) {
        console.error('❌ HDRI loading failed completely:', error);
        setIsLoading(false);
        onError?.(error as Error);
      }
    };

    loadHDRI();
  }, [environment.hdriUrl, environment.fallbackUrl, onLoad, onError]);

  useFrame(() => {
    if (sphereRef.current && environment.rotation !== 0) {
      sphereRef.current.rotation.y += environment.rotation * 0.001;
    }
  });

  if (isLoading || !texture) {
    return null;
  }

  return (
    <Sphere ref={sphereRef} args={[100]} scale={[-1, 1, 1]} position={[0, 0, 0]}>
      <meshBasicMaterial 
        map={texture}
        side={THREE.BackSide}
        toneMapped={false}
        transparent={false}
      />
    </Sphere>
  );
};

const HDRIFallback: React.FC<{ environmentIntensity: number }> = ({ environmentIntensity }) => (
  <>
    <Environment preset="studio" />
    <ambientLight intensity={0.3 * environmentIntensity} />
    <directionalLight
      position={[10, 10, 5]}
      intensity={0.5 * environmentIntensity}
      castShadow
    />
  </>
);

export const EnhancedHDRIEnvironment: React.FC<EnhancedHDRIEnvironmentProps> = ({
  environment,
  onLoadComplete,
  onLoadError
}) => {
  const { gl } = useThree();

  useEffect(() => {
    console.log('🎨 Configuring HDRI environment:', environment.name);
    
    // Configure tone mapping and exposure
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = environment.lighting.exposure;
    
    // Enable shadows
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    
  }, [gl, environment]);

  return (
    <Suspense fallback={<HDRIFallback environmentIntensity={environment.lighting.environmentIntensity} />}>
      <HDRITexture 
        environment={environment}
        onLoad={onLoadComplete}
        onError={onLoadError}
      />
      
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.2 * environment.lighting.intensity} />
      
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.6 * environment.lighting.intensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Additional fill light for card visibility */}
      <hemisphereLight
        skyColor={0xffffff}
        groundColor={0x444444}
        intensity={0.3 * environment.lighting.intensity}
      />
    </Suspense>
  );
};
