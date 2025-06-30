
import { useState, useCallback, useRef } from 'react';
import type { CardData } from '@/types/card';

interface SafetyState {
  imageError: boolean;
  imageLoading: boolean;
  effectsError: boolean;
  fallbackActive: boolean;
}

export const useCardRenderingSafety = (card?: CardData) => {
  const [safetyState, setSafetyState] = useState<SafetyState>({
    imageError: false,
    imageLoading: true,
    effectsError: false,
    fallbackActive: false
  });

  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Safe image URL handler
  const getSafeImageUrl = useCallback((imageUrl?: string): string => {
    if (!imageUrl || imageUrl.startsWith('blob:') || safetyState.imageError) {
      return '/placeholder.svg';
    }
    return imageUrl;
  }, [safetyState.imageError]);

  // Image loading handlers
  const handleImageLoad = useCallback(() => {
    setSafetyState(prev => ({ ...prev, imageLoading: false, imageError: false }));
    retryCountRef.current = 0;
  }, []);

  const handleImageError = useCallback(() => {
    console.warn('🚨 Image failed to load:', card?.image_url);
    
    if (retryCountRef.current < maxRetries) {
      retryCountRef.current++;
      console.log(`🔄 Retrying image load (${retryCountRef.current}/${maxRetries})`);
      // Trigger retry by updating state
      setSafetyState(prev => ({ ...prev, imageLoading: true }));
      return;
    }

    setSafetyState(prev => ({ 
      ...prev, 
      imageError: true, 
      imageLoading: false,
      fallbackActive: true 
    }));
  }, [card?.image_url]);

  // Effects error handler
  const handleEffectsError = useCallback((error: Error) => {
    console.error('🚨 Effects rendering error:', error);
    setSafetyState(prev => ({ 
      ...prev, 
      effectsError: true,
      fallbackActive: true 
    }));
  }, []);

  // Reset safety state
  const resetSafety = useCallback(() => {
    setSafetyState({
      imageError: false,
      imageLoading: true,
      effectsError: false,
      fallbackActive: false
    });
    retryCountRef.current = 0;
  }, []);

  return {
    safetyState,
    getSafeImageUrl,
    handleImageLoad,
    handleImageError,
    handleEffectsError,
    resetSafety,
    isImageSafe: !safetyState.imageError && !safetyState.imageLoading,
    shouldUseFallback: safetyState.fallbackActive
  };
};
