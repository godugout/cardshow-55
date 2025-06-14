
import { useMemo, useRef } from 'react';
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

  // Create a stable hash for the effect values to detect changes
  const effectsHash = useMemo(() => {
    const relevantData = {
      effects: Object.entries(effectValues).filter(([_, effect]) => 
        effect.intensity && typeof effect.intensity === 'number' && effect.intensity > 0
      ),
      showEffects,
      interactiveLighting: interactiveLighting && isHovering,
      mouseX: Math.round(mousePosition.x * 10) / 10, // Round to reduce recalculation frequency
      mouseY: Math.round(mousePosition.y * 10) / 10
    };
    
    return JSON.stringify(relevantData);
  }, [effectValues, showEffects, interactiveLighting, isHovering, mousePosition]);

  // Only recalculate if the hash has changed
  const optimizedEffectStyles = useMemo(() => {
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
        
        const enhancementFactor = Math.min(avgIntensity / 100 * 0.3, 0.3);
        styles.filter = `contrast(${1 + enhancementFactor * 0.1}) saturate(${1 + enhancementFactor * 0.2})`;
        styles.transition = 'all 0.3s ease';
        
        if (interactiveLighting && isHovering) {
          const lightBoost = (mousePosition.x * 0.1 + mousePosition.y * 0.1) * enhancementFactor;
          styles.filter += ` brightness(${1 + lightBoost})`;
        }
      }
    }
    
    // Cache the result
    lastCalculationRef.current = effectsHash;
    cachedResultRef.current = styles;
    
    return styles;
  }, [effectsHash]);

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
