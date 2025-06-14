
import { useState, useEffect, useMemo } from 'react';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { localImageCache } from '../LocalImageCache';

interface UseTextureLoaderProps {
  imageId: string;
  onLoadComplete?: () => void;
  onLoadError?: (error: Error) => void;
}

export const useTextureLoader = ({
  imageId,
  onLoadComplete,
  onLoadError
}: UseTextureLoaderProps) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
            loadedTexture.flipY = true; // Fixed: changed from false to true
            
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
            const errorObj = error instanceof Error ? error : new Error('Texture creation failed');
            setHasError(true);
            setIsLoading(false);
            onLoadError?.(errorObj);
          }
        );
        
      } catch (error) {
        if (!isMounted) return;
        console.error('❌ Environment loading failed:', error);
        const errorObj = error instanceof Error ? error : new Error('Environment loading failed');
        setHasError(true);
        setIsLoading(false);
        onLoadError?.(errorObj);
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

  return { texture, isLoading, hasError };
};
