
import { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { createPanoramicFallback } from '../utils/panoramicFallback';

interface UsePanoramicTextureProps {
  image: HTMLImageElement | null;
  loadError: Error | null;
  isLoading: boolean;
  exposure: number;
}

export const usePanoramicTexture = ({
  image,
  loadError,
  isLoading,
  exposure
}: UsePanoramicTextureProps) => {
  const { gl, scene } = useThree();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (loadError) {
      // Apply fallback texture when there's an error
      const fallbackTexture = createPanoramicFallback();
      scene.environment = fallbackTexture;
      scene.background = fallbackTexture;
      return;
    }

    if (!image || isLoading) return;

    let isMounted = true;
    
    // Create texture from loaded image
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
        loadedTexture.flipY = true; // Fixed: changed from false to true
        
        // Enhanced filtering
        loadedTexture.magFilter = THREE.LinearFilter;
        loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
        loadedTexture.generateMipmaps = true;
        
        // Color space
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        
        setTexture(loadedTexture);
        console.log('✨ Texture set and loading cleared');
      },
      undefined,
      (error) => {
        if (!isMounted) return;
        console.error('❌ Failed to create texture:', error);
      }
    );
    
    return () => {
      isMounted = false;
      if (texture) {
        texture.dispose();
      }
    };
  }, [image, loadError, isLoading, scene]);

  useEffect(() => {
    if (texture && !isLoading) {
      // Apply loaded texture only when we have it and aren't loading
      console.log('🎨 Applying 360° texture to scene');
      
      scene.environment = texture;
      scene.background = texture;
      
      // Configure tone mapping
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = exposure;
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
      
      console.log('✨ 360° environment configured successfully');
    }
    
    return () => {
      // Clean up when component unmounts or texture changes
      if (scene.environment === texture) {
        scene.environment = null;
      }
      if (scene.background === texture) {
        scene.background = null;
      }
    };
  }, [texture, scene, gl, exposure, isLoading]);

  return { texture };
};
