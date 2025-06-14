
import React, { useEffect, useState, Suspense } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { HDRILoader } from './utils/HDRILoader';
import type { HDRIEnvironment } from './HDRILibrary';

interface EnhancedHDRIEnvironmentProps {
  environment: HDRIEnvironment;
  onLoadComplete?: () => void;
  onLoadError?: (error: Error) => void;
}

const HDRISceneEnvironment: React.FC<{ 
  environment: HDRIEnvironment; 
  onLoad?: () => void;
  onError?: (error: Error) => void;
}> = ({ environment, onLoad, onError }) => {
  const { gl, scene } = useThree();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  
  useEffect(() => {
    let isMounted = true;
    
    const loadEnvironment = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        setLoadProgress(0);
        
        console.log('🌍 Loading HDRI environment:', {
          name: environment.name,
          hdriUrl: environment.hdriUrl,
          fallbackUrl: environment.fallbackUrl,
          category: environment.category
        });
        
        const texture = await HDRILoader.loadHDRI({
          url: environment.hdriUrl,
          fallbackUrl: environment.fallbackUrl,
          onProgress: (progress) => {
            console.log(`📊 Loading progress: ${progress.toFixed(1)}%`);
            setLoadProgress(progress);
          },
          onLoad: (loadedTexture) => {
            if (!isMounted) return;
            
            console.log('✅ HDRI texture loaded, applying to scene:', {
              name: environment.name,
              dimensions: loadedTexture.image ? `${loadedTexture.image.width}x${loadedTexture.image.height}` : 'unknown',
              mapping: loadedTexture.mapping,
              format: loadedTexture.format
            });
            
            // Apply texture to scene background and environment
            scene.background = loadedTexture;
            scene.environment = loadedTexture;
            
            // Configure tone mapping and render settings
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = environment.lighting.exposure;
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            
            setIsLoading(false);
            setLoadProgress(100);
            onLoad?.();
            
            console.log('✨ HDRI environment applied successfully:', {
              name: environment.name,
              exposure: environment.lighting.exposure,
              backgroundBlurriness: environment.lighting.backgroundBlurriness
            });
          },
          onError: (error) => {
            if (!isMounted) return;
            console.error('❌ HDRI loading failed:', {
              name: environment.name,
              error: error.message,
              hdriUrl: environment.hdriUrl,
              fallbackUrl: environment.fallbackUrl
            });
            setLoadError(error);
            setIsLoading(false);
            onError?.(error);
          }
        });
        
      } catch (error) {
        if (!isMounted) return;
        console.error('❌ HDRI environment setup failed:', {
          name: environment.name,
          error: error instanceof Error ? error.message : String(error)
        });
        setLoadError(error as Error);
        setIsLoading(false);
        onError?.(error as Error);
      }
    };

    loadEnvironment();
    
    return () => {
      isMounted = false;
      // Clean up scene on unmount
      if (scene.background) {
        console.log('🧹 Cleaning up scene background');
        scene.background = null;
      }
      if (scene.environment) {
        console.log('🧹 Cleaning up scene environment');
        scene.environment = null;
      }
    };
  }, [environment.hdriUrl, environment.fallbackUrl, environment.name, gl, scene, onLoad, onError, environment.lighting.exposure]);

  // Show loading progress in console
  useEffect(() => {
    if (isLoading && loadProgress > 0) {
      console.log(`⏳ HDRI loading ${environment.name}: ${loadProgress.toFixed(1)}%`);
    }
  }, [loadProgress, isLoading, environment.name]);

  // Don't render anything - we're applying directly to the scene
  return null;
};

const HDRIFallback: React.FC<{ environmentIntensity: number }> = ({ environmentIntensity }) => {
  const { scene, gl } = useThree();
  
  useEffect(() => {
    console.log('🎨 Applying HDRI fallback environment');
    
    // Create a simple gradient background as fallback
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.7, '#98FB98'); // Pale green
    gradient.addColorStop(1, '#228B22'); // Forest green
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);
    
    const fallbackTexture = new THREE.CanvasTexture(canvas);
    fallbackTexture.mapping = THREE.EquirectangularReflectionMapping;
    fallbackTexture.colorSpace = THREE.SRGBColorSpace;
    
    scene.background = fallbackTexture;
    scene.environment = fallbackTexture;
    
    // Configure basic tone mapping
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.0;
    
    console.log('🎨 Fallback environment applied');
    
    return () => {
      fallbackTexture.dispose();
    };
  }, [scene, gl]);

  return (
    <>
      <ambientLight intensity={0.3 * environmentIntensity} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.5 * environmentIntensity}
        castShadow
      />
    </>
  );
};

export const EnhancedHDRIEnvironment: React.FC<EnhancedHDRIEnvironmentProps> = ({
  environment,
  onLoadComplete,
  onLoadError
}) => {
  console.log('🎨 Setting up HDRI environment:', {
    name: environment.name,
    category: environment.category,
    hdriUrl: environment.hdriUrl
  });

  return (
    <Suspense fallback={<HDRIFallback environmentIntensity={environment.lighting.environmentIntensity} />}>
      <HDRISceneEnvironment 
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
      
      <hemisphereLight
        args={[0xffffff, 0x444444]}
        intensity={0.3 * environment.lighting.intensity}
      />
    </Suspense>
  );
};
