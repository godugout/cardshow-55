
import { useEffect, useState, useCallback } from 'react';
import { useLoader } from '@react-three/fiber';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { TextureLoader, Texture, EquirectangularReflectionMapping } from 'three';
import { hdriCache } from '../utils/hdriCache';

interface HDRILoadState {
  texture: Texture | null;
  isLoading: boolean;
  error: string | null;
  fallbackTexture: Texture | null;
}

interface UseHDRILoaderOptions {
  hdriUrl?: string;
  fallbackUrl?: string;
  intensity?: number;
  enableCaching?: boolean;
}

export const useHDRILoader = ({
  hdriUrl,
  fallbackUrl,
  intensity = 1.0,
  enableCaching = true
}: UseHDRILoaderOptions): HDRILoadState => {
  const [state, setState] = useState<HDRILoadState>({
    texture: null,
    isLoading: false,
    error: null,
    fallbackTexture: null
  });

  // Load fallback texture
  const fallbackTexture = fallbackUrl ? useLoader(TextureLoader, fallbackUrl) : null;

  const loadHDRI = useCallback(async (url: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Check cache first
      if (enableCaching && hdriCache.has(url)) {
        const cachedTexture = hdriCache.get(url);
        if (cachedTexture) {
          setState(prev => ({
            ...prev,
            texture: cachedTexture,
            isLoading: false
          }));
          return;
        }
      }

      // Load HDRI texture
      const loader = new RGBELoader();
      
      // Optimize for mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        // Use lower precision for mobile
        loader.setDataType(1016); // HalfFloatType
      }

      const texture = await new Promise<Texture>((resolve, reject) => {
        loader.load(
          url,
          (texture) => {
            // Configure texture for environment mapping
            texture.mapping = EquirectangularReflectionMapping;
            resolve(texture);
          },
          undefined,
          reject
        );
      });

      // Cache the loaded texture
      if (enableCaching) {
        hdriCache.set(url, texture);
      }

      setState(prev => ({
        ...prev,
        texture,
        isLoading: false,
        error: null
      }));

    } catch (error) {
      console.warn('Failed to load HDRI:', error);
      setState(prev => ({
        ...prev,
        texture: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load HDRI',
        fallbackTexture
      }));
    }
  }, [enableCaching, fallbackTexture]);

  // Load HDRI when URL changes
  useEffect(() => {
    if (hdriUrl) {
      loadHDRI(hdriUrl);
    } else {
      setState(prev => ({
        ...prev,
        texture: null,
        isLoading: false,
        error: null
      }));
    }
  }, [hdriUrl, loadHDRI]);

  // Update texture intensity
  useEffect(() => {
    if (state.texture && intensity !== undefined) {
      // Store original intensity for restoration
      if (!state.texture.userData.originalIntensity) {
        state.texture.userData.originalIntensity = 1.0;
      }
      // Note: Intensity is typically handled by the Environment component
    }
  }, [state.texture, intensity]);

  return {
    ...state,
    fallbackTexture
  };
};
