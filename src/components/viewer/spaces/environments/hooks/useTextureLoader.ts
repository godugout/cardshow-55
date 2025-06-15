
import { useState, useEffect, useMemo, useCallback } from 'react';
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

  // Create a stable callback for error handling
  const handleError = useCallback((error: Error | unknown) => {
    console.error('❌ Texture loading failed:', error);
    const errorObj = error instanceof Error ? error : new Error('Texture loading failed');
    setHasError(true);
    setIsLoading(false);
    onLoadError?.(errorObj);
  }, [onLoadError]);

  // Create a stable callback for success
  const handleSuccess = useCallback((loadedTexture: THREE.Texture) => {
    console.log('✅ Environment texture loaded:', imageId);
    
    // Configure for 360° panoramic mapping
    loadedTexture.mapping = THREE.EquirectangularReflectionMapping;
    loadedTexture.wrapS = THREE.RepeatWrapping;
    loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
    loadedTexture.flipY = true;
    
    // Enhanced filtering
    loadedTexture.magFilter = THREE.LinearFilter;
    loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
    loadedTexture.generateMipmaps = true;
    loadedTexture.colorSpace = THREE.SRGBColorSpace;
    
    setTexture(loadedTexture);
    setIsLoading(false);
    setHasError(false);
    onLoadComplete?.();
  }, [imageId, onLoadComplete]);

  useEffect(() => {
    // Reset state when imageId changes
    setIsLoading(true);
    setHasError(false);
    setTexture(null);

    // Validate imageId
    if (!imageId || typeof imageId !== 'string') {
      handleError(new Error('Invalid imageId provided'));
      return;
    }

    let isMounted = true;
    let currentTexture: THREE.Texture | null = null;
    
    const loadEnvironmentTexture = async () => {
      try {
        console.log('🔄 Loading environment texture:', imageId);
        
        // Load image through cache with error handling
        const image = await localImageCache.loadImage(imageId);
        
        if (!isMounted) return;
        
        // Validate image
        if (!image || !image.src) {
          throw new Error('Invalid image loaded from cache');
        }
        
        // Create texture from cached image
        currentTexture = textureLoader.load(
          image.src,
          (loadedTexture) => {
            if (!isMounted) return;
            handleSuccess(loadedTexture);
          },
          undefined,
          (error) => {
            if (!isMounted) return;
            handleError(error);
          }
        );
        
      } catch (error) {
        if (!isMounted) return;
        handleError(error);
      }
    };

    loadEnvironmentTexture();
    
    return () => {
      isMounted = false;
      if (currentTexture) {
        currentTexture.dispose();
      }
      if (texture) {
        texture.dispose();
      }
    };
  }, [imageId, textureLoader, handleError, handleSuccess]);

  return { texture, isLoading, hasError };
};
