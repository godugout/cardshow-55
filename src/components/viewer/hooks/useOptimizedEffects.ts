
import { useMemo, useRef, useCallback } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';

interface UseOptimizedEffectsOptions {
  effectValues: EffectValues;
  showEffects: boolean;
  interactiveLighting: boolean;
  isHovering: boolean;
  mousePosition: { x: number; y: number };
}

export const useOptimizedEffects = ({
  effectValues,
  showEffects,
  interactiveLighting,
  isHovering,
  mousePosition
}: UseOptimizedEffectsOptions) => {
  const lastCalculationRef = useRef<string>('');
  const cachedResultRef = useRef<React.CSSProperties>({});
  const throttleRef = useRef<NodeJS.Timeout>();

  // Create a stable hash for the effect values to detect changes
  const effectsHash = useMemo(() => {
    const relevantData = {
      effects: Object.entries(effectValues).filter(([_, effect]) => 
        effect.intensity && typeof effect.intensity === 'number' && effect.intensity > 0
      ),
      showEffects,
      interactiveLighting: interactiveLighting && isHovering,
      mouseX: Math.round(mousePosition.x * 5) / 5, // Less granular to reduce recalculations
      mouseY: Math.round(mousePosition.y * 5) / 5
    };
    
    return JSON.stringify(relevantData);
  }, [effectValues, showEffects, interactiveLighting, isHovering, mousePosition]);

  // Throttled calculation function
  const calculateStyles = useCallback(() => {
    if (effectsHash === lastCalculationRef.current) {
      return cachedResultRef.current;
    }

    const styles: React.CSSProperties = {};
    
    if (showEffects) {
      const activeEffects = Object.entries(effectValues).filter(([_, effect]) => 
        effect.intensity && typeof effect.intensity === 'number' && effect.intensity > 0
      );
      
      if (activeEffects.length > 0) {
        const avgIntensity = activeEffects.reduce((sum, [_, effect]) => 
          sum + (effect.intensity as number), 0) / activeEffects.length;
        
        const enhancementFactor = Math.min(avgIntensity / 100 * 0.2, 0.2); // Reduced intensity
        
        // Build filter string more efficiently
        const filterParts: string[] = [];
        
        if (enhancementFactor > 0.01) {
          filterParts.push(`contrast(${1 + enhancementFactor * 0.05})`);
          filterParts.push(`saturate(${1 + enhancementFactor * 0.1})`);
        }
        
        if (interactiveLighting && isHovering && enhancementFactor > 0.01) {
          const lightBoost = (mousePosition.x * 0.05 + mousePosition.y * 0.05) * enhancementFactor;
          if (lightBoost > 0.01) {
            filterParts.push(`brightness(${Math.min(1 + lightBoost, 1.3)})`);
          }
        }
        
        if (filterParts.length > 0) {
          styles.filter = filterParts.join(' ');
          styles.transition = 'filter 0.3s ease';
        }
      }
    }
    
    // Cache the result
    lastCalculationRef.current = effectsHash;
    cachedResultRef.current = styles;
    
    return styles;
  }, [effectsHash, effectValues, showEffects, interactiveLighting, isHovering, mousePosition]);

  // Only recalculate with throttling to prevent excessive updates
  const optimizedEffectStyles = useMemo(() => {
    if (throttleRef.current) {
      clearTimeout(throttleRef.current);
    }
    
    return calculateStyles();
  }, [calculateStyles]);

  // Check if any effects are active for performance decisions
  const hasActiveEffects = useMemo(() => {
    return Object.values(effectValues).some(effect => 
      effect.intensity && typeof effect.intensity === 'number' && effect.intensity > 0
    );
  }, [effectValues]);

  return {
    optimizedEffectStyles,
    hasActiveEffects,
    shouldUseHighPerformanceMode: !hasActiveEffects && !interactiveLighting
  };
};
