
import { useCallback, useMemo } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface StudioEffectsBridgeProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  effectValues: EffectValues;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  interactiveLighting: boolean;
}

export const useStudioEffectsBridge = ({
  selectedScene,
  selectedLighting,
  effectValues,
  materialSettings,
  overallBrightness,
  interactiveLighting
}: StudioEffectsBridgeProps) => {
  
  // Convert Studio state to card-compatible effects
  const bridgedEffects = useMemo((): EffectValues => {
    const effects: EffectValues = { ...effectValues };
    
    // Scene-based effects
    if (selectedScene.id === 'holographic') {
      effects.holographic = { 
        intensity: Math.max(effects.holographic?.intensity || 0, 60),
        ...effects.holographic 
      };
    }
    
    if (selectedScene.id === 'chrome') {
      effects.chrome = { 
        intensity: Math.max(effects.chrome?.intensity || 0, 50),
        ...effects.chrome 
      };
    }
    
    if (selectedScene.id === 'gold') {
      effects.gold = { 
        intensity: Math.max(effects.gold?.intensity || 0, 70),
        goldTone: 'classic',
        ...effects.gold 
      };
    }
    
    // Lighting-based effects
    if (selectedLighting.id === 'neon') {
      effects.neon = { 
        intensity: Math.max(effects.neon?.intensity || 0, 40),
        neonColor: '#00ff00',
        ...effects.neon 
      };
    }
    
    // Material-based enhancements
    if (materialSettings.metalness > 0.7) {
      effects.chrome = { 
        intensity: Math.max(effects.chrome?.intensity || 0, materialSettings.metalness * 60),
        ...effects.chrome 
      };
    }
    
    return effects;
  }, [selectedScene, selectedLighting, effectValues, materialSettings]);
  
  // Calculate dynamic brightness based on effects and brightness setting
  const dynamicBrightness = useMemo(() => {
    const baseBrightness = overallBrightness[0] / 100;
    const activeEffectsCount = Object.values(bridgedEffects).filter(
      effect => typeof effect.intensity === 'number' && effect.intensity > 20
    ).length;
    
    // Boost brightness when multiple effects are active
    const effectBoost = activeEffectsCount > 0 ? 1 + (activeEffectsCount * 0.1) : 1;
    return Math.min(baseBrightness * effectBoost, 2.0);
  }, [overallBrightness, bridgedEffects]);
  
  // Enhanced interactive lighting based on Studio settings
  const enhancedInteractiveLighting = useMemo(() => {
    return interactiveLighting && Object.keys(bridgedEffects).length > 0;
  }, [interactiveLighting, bridgedEffects]);
  
  return {
    bridgedEffects,
    dynamicBrightness,
    enhancedInteractiveLighting,
    activeEffectsCount: Object.values(bridgedEffects).filter(
      effect => typeof effect.intensity === 'number' && effect.intensity > 10
    ).length
  };
};
