
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createProceduralFallback } from '../utils/fallbackGenerator';

interface UseSceneBackgroundProps {
  texture: THREE.Texture | null;
  hasError: boolean;
  exposure: number;
}

export const useSceneBackground = ({
  texture,
  hasError,
  exposure
}: UseSceneBackgroundProps) => {
  const { gl, scene } = useThree();

  useEffect(() => {
    if (!texture || hasError) {
      // Create procedural fallback only when there's an actual error
      if (hasError) {
        const fallbackTexture = createProceduralFallback();
        scene.background = fallbackTexture;
        scene.environment = fallbackTexture;
      }
      return;
    }

    console.log('🎨 Applying environment texture to scene');
    
    // Remove any existing background color to prevent conflicts
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
};
