
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { createProceduralFallback } from './utils/fallbackGenerator';

interface SimplePanoramicEnvironmentProps {
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

export const SimplePanoramicEnvironment: React.FC<SimplePanoramicEnvironmentProps> = ({
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
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log('🌍 SimplePanoramicEnvironment loading:', imageUrl);
  
  useEffect(() => {
    let isMounted = true;
    const textureLoader = new TextureLoader();
    
    const loadTexture = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        onLoadStart?.();
        
        const loadedTexture = await new Promise<THREE.Texture>((resolve, reject) => {
          textureLoader.load(
            imageUrl,
            (tex) => {
              console.log('✅ Panoramic texture loaded');
              resolve(tex);
            },
            undefined,
            (error) => {
              console.warn('⚠️ Primary texture failed, trying fallback');
              
              if (fallbackUrl) {
                textureLoader.load(
                  fallbackUrl,
                  (tex) => {
                    console.log('✅ Fallback texture loaded');
                    resolve(tex);
                  },
                  undefined,
                  (fallbackError) => {
                    console.error('❌ Both textures failed');
                    reject(fallbackError);
                  }
                );
              } else {
                reject(error);
              }
            }
          );
        });
        
        if (!isMounted) return;
        
        // Configure texture for panoramic use
        loadedTexture.mapping = THREE.EquirectangularReflectionMapping;
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
        loadedTexture.flipY = true;
        loadedTexture.magFilter = THREE.LinearFilter;
        loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
        loadedTexture.generateMipmaps = true;
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        
        setTexture(loadedTexture);
        setIsLoading(false);
        onLoadComplete?.();
        
      } catch (error) {
        if (!isMounted) return;
        
        console.error('💥 All texture loading failed, using procedural fallback');
        const fallbackTexture = createProceduralFallback();
        setTexture(fallbackTexture);
        setHasError(true);
        setIsLoading(false);
        onLoadError?.(error as Error);
      }
    };
    
    loadTexture();
    
    return () => {
      isMounted = false;
    };
  }, [imageUrl, fallbackUrl, onLoadStart, onLoadComplete, onLoadError]);

  useEffect(() => {
    if (!texture) return;
    
    // Apply texture to scene
    scene.environment = texture;
    scene.background = texture;
    
    // Configure renderer
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = exposure;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    
    return () => {
      if (scene.environment === texture) {
        scene.environment = null;
      }
      if (scene.background === texture) {
        scene.background = null;
      }
    };
  }, [texture, scene, gl, exposure]);

  useFrame(() => {
    if (sphereRef.current && rotation !== 0) {
      sphereRef.current.rotation.y += rotation * 0.001;
    }
  });

  return (
    <>
      {/* Enhanced lighting system */}
      <ambientLight intensity={0.5 * brightness} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.8 * brightness}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        position={[-10, 10, -10]}
        intensity={0.4 * brightness}
        color="#ffffff"
      />
      
      {/* Backup sphere for additional environment */}
      {texture && (
        <mesh 
          ref={sphereRef} 
          scale={[-1000, 1000, 1000]} 
          visible={false}
        >
          <sphereGeometry args={[1, 32, 16]} />
          <meshBasicMaterial
            map={texture}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </>
  );
};
