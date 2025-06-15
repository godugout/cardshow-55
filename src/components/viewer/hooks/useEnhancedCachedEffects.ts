
import { useMemo, useRef, useCallback } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from './useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { useTextureCache } from './useTextureCache';

interface UseEnhancedCachedEffectsParams {
  card: CardData;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  showEffects: boolean;
  overallBrightness: number[];
  interactiveLighting: boolean;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  zoom: number;
  rotation: { x: number; y: number };
  isHovering: boolean;
}

export const useEnhancedCachedEffects = (params: UseEnhancedCachedEffectsParams) => {
  const {
    card,
    selectedScene,
    selectedLighting,
    overallBrightness,
    mousePosition,
    showEffects,
    effectValues,
    isHovering,
    interactiveLighting
  } = params;

  // Use texture cache for image preloading
  const { isImageLoaded, getCachedImage } = useTextureCache(card);
  
  // Cache for computed styles to prevent recalculation
  const styleCache = useRef(new Map<string, React.CSSProperties>());
  
  // Create cache key for current state
  const cacheKey = useMemo(() => {
    const effectHash = JSON.stringify(
      Object.entries(effectValues || {})
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => [key, value?.intensity || 0])
    );
    
    return `${selectedScene.id}-${selectedLighting.id}-${overallBrightness[0]}-${effectHash}-${showEffects}-${interactiveLighting}`;
  }, [effectValues, selectedScene.id, selectedLighting.id, overallBrightness, showEffects, interactiveLighting]);

  // Cached frame styles with optimizations
  const frameStyles = useMemo(() => {
    const cached = styleCache.current.get(`frame-${cacheKey}`);
    if (cached) return cached;
    
    const styles: React.CSSProperties = {
      filter: `brightness(${overallBrightness[0]}%)`,
      transition: 'all 0.3s ease',
      willChange: 'transform, filter',
      backfaceVisibility: 'hidden'
    };
    
    styleCache.current.set(`frame-${cacheKey}`, styles);
    return styles;
  }, [cacheKey, overallBrightness]);

  // Enhanced effect styles with GPU optimization
  const enhancedEffectStyles = useMemo(() => {
    const cached = styleCache.current.get(`effects-${cacheKey}-${mousePosition.x}-${mousePosition.y}`);
    if (cached) return cached;
    
    const styles: React.CSSProperties = {};
    
    if (showEffects) {
      const activeEffects = Object.entries(effectValues).filter(([_, effect]) => 
        effect.intensity && typeof effect.intensity === 'number' && effect.intensity > 0
      );
      
      if (activeEffects.length > 0) {
        const avgIntensity = activeEffects.reduce((sum, [_, effect]) => 
          sum + (effect.intensity as number), 0) / activeEffects.length;
        
        const enhancementFactor = Math.min(avgIntensity / 100 * 0.3, 0.3);
        styles.filter = `contrast(${1 + enhancementFactor * 0.1}) saturate(${1 + enhancementFactor * 0.2})`;
        styles.transition = 'all 0.3s ease';
        styles.willChange = 'filter';
        
        if (interactiveLighting && isHovering) {
          const lightBoost = (mousePosition.x * 0.1 + mousePosition.y * 0.1) * enhancementFactor;
          styles.filter += ` brightness(${1 + lightBoost})`;
        }
      }
    }
    
    styleCache.current.set(`effects-${cacheKey}-${mousePosition.x}-${mousePosition.y}`, styles);
    return styles;
  }, [cacheKey, mousePosition, showEffects, effectValues, interactiveLighting, isHovering]);

  // Optimized surface texture with memoization
  const SurfaceTexture = useMemo(() => {
    const textureOpacity = showEffects ? 0.05 : 0.1;
    return (
      <div 
        className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/5 to-transparent"
        style={{
          opacity: textureOpacity,
          mixBlendMode: 'overlay',
          background: `
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
            linear-gradient(45deg, rgba(255,255,255,0.05) 0%, transparent 100%)
          `,
          willChange: 'opacity'
        }}
      />
    );
  }, [showEffects]);

  // Clear cache when component unmounts
  const clearCache = useCallback(() => {
    styleCache.current.clear();
  }, []);

  return {
    frameStyles,
    enhancedEffectStyles,
    SurfaceTexture,
    isImageLoaded,
    getCachedImage,
    clearCache
  };
};
