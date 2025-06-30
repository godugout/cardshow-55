
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
  
  // Helper function to safely get effect intensity as number
  const getEffectIntensity = useCallback((effect: any): number => {
    if (typeof effect?.intensity === 'number') {
      return effect.intensity;
    }
    return 0;
  }, []);
  
  // Convert Studio state to card-compatible effects
  const bridgedEffects = useMemo((): EffectValues => {
    const effects: EffectValues = { ...effectValues };
    
    // Scene-based effects
    if (selectedScene.id === 'holographic') {
      effects.holographic = { 
        intensity: Math.max(getEffectIntensity(effects.holographic), 60),
        ...effects.holographic 
      };
    }
    
    if (selectedScene.id === 'chrome') {
      effects.chrome = { 
        intensity: Math.max(getEffectIntensity(effects.chrome), 50),
        ...effects.chrome 
      };
    }
    
    if (selectedScene.id === 'gold') {
      effects.gold = { 
        intensity: Math.max(getEffectIntensity(effects.gold), 70),
        goldTone: 'classic',
        ...effects.gold 
      };
    }
    
    // Lighting-based effects
    if (selectedLighting.id === 'neon') {
      effects.neon = { 
        intensity: Math.max(getEffectIntensity(effects.neon), 40),
        neonColor: '#00ff00',
        ...effects.neon 
      };
    }
    
    // Material-based enhancements
    if (materialSettings.metalness > 0.7) {
      effects.chrome = { 
        intensity: Math.max(getEffectIntensity(effects.chrome), materialSettings.metalness * 60),
        ...effects.chrome 
      };
    }
    
    return effects;
  }, [selectedScene, selectedLighting, effectValues, materialSettings, getEffectIntensity]);
  
  // Calculate dynamic brightness based on effects and brightness setting
  const dynamicBrightness = useMemo(() => {
    const baseBrightness = overallBrightness[0] / 100;
    const activeEffectsCount = Object.values(bridgedEffects).filter(
      effect => getEffectIntensity(effect) > 20
    ).length;
    
    // Boost brightness when multiple effects are active
    const effectBoost = activeEffectsCount > 0 ? 1 + (activeEffectsCount * 0.1) : 1;
    return Math.min(baseBrightness * effectBoost, 2.0);
  }, [overallBrightness, bridgedEffects, getEffectIntensity]);
  
  // Enhanced interactive lighting based on Studio settings
  const enhancedInteractiveLighting = useMemo(() => {
    return interactiveLighting && Object.keys(bridgedEffects).length > 0;
  }, [interactiveLighting, bridgedEffects]);
  
  return {
    bridgedEffects,
    dynamicBrightness,
    enhancedInteractiveLighting,
    activeEffectsCount: Object.values(bridgedEffects).filter(
      effect => getEffectIntensity(effect) > 10
    ).length
  };
};
