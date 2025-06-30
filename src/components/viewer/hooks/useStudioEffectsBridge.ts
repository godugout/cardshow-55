
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
  
  // Convert Studio state to card-compatible effects with enhanced state validation
  const bridgedEffects = useMemo((): EffectValues => {
    console.log('🌉 StudioEffectsBridge: Processing effectValues:', effectValues);
    
    // Validate input - ensure we have valid effect values
    if (!effectValues || Object.keys(effectValues).length === 0) {
      console.warn('⚠️ StudioEffectsBridge: Received empty effectValues, using defaults');
      return {
        brushedmetal: { intensity: 15 } // Ensure card back remains visible
      };
    }
    
    // Start with existing effect values as base (deep copy to prevent mutations)
    const effects: EffectValues = JSON.parse(JSON.stringify(effectValues));
    
    // Ensure minimum base effect for card back visibility
    if (!effects.brushedmetal || getEffectIntensity(effects.brushedmetal) < 10) {
      if (!effects.brushedmetal) effects.brushedmetal = {};
      effects.brushedmetal.intensity = Math.max(15, getEffectIntensity(effects.brushedmetal));
      console.log('🛡️ Ensuring card back visibility with brushedmetal base');
    }
    
    // Scene-based enhancements (additive, not replacement)
    if (selectedScene.id === 'holographic') {
      const currentIntensity = getEffectIntensity(effects.holographic);
      if (currentIntensity < 50) {
        effects.holographic = { 
          intensity: Math.max(currentIntensity, 60),
          shiftSpeed: 150,
          rainbowSpread: 270,
          animated: true,
          ...effects.holographic 
        };
        console.log('🌈 Enhanced holographic scene effect');
      }
    }
    
    if (selectedScene.id === 'chrome') {
      const currentIntensity = getEffectIntensity(effects.chrome);
      if (currentIntensity < 40) {
        effects.chrome = { 
          intensity: Math.max(currentIntensity, 50),
          sharpness: 95,
          highlightSize: 70,
          ...effects.chrome 
        };
        console.log('🪞 Enhanced chrome scene effect');
      }
    }
    
    if (selectedScene.id === 'gold') {
      const currentIntensity = getEffectIntensity(effects.gold);
      if (currentIntensity < 60) {
        effects.gold = { 
          intensity: Math.max(currentIntensity, 70),
          goldTone: 'classic',
          shimmerSpeed: 80,
          platingThickness: 5,
          ...effects.gold 
        };
        console.log('🏆 Enhanced gold scene effect');
      }
    }
    
    // Lighting-based enhancements
    if (selectedLighting.id === 'neon') {
      const currentIntensity = getEffectIntensity(effects.neon);
      if (currentIntensity < 30) {
        effects.neon = { 
          intensity: Math.max(currentIntensity, 40),
          neonColor: '#00ff00',
          ...effects.neon 
        };
        console.log('💚 Enhanced neon lighting effect');
      }
    }
    
    // Material-based enhancements
    if (materialSettings.metalness > 0.7) {
      const currentIntensity = getEffectIntensity(effects.chrome);
      const materialBoost = materialSettings.metalness * 50;
      if (currentIntensity < materialBoost) {
        effects.chrome = { 
          intensity: Math.max(currentIntensity, materialBoost),
          sharpness: 90,
          highlightSize: 60,
          ...effects.chrome 
        };
        console.log('🛠️ Enhanced material metalness boost');
      }
    }
    
    console.log('🌉 StudioEffectsBridge: Final bridged effects:', effects);
    return effects;
  }, [selectedScene, selectedLighting, effectValues, materialSettings, getEffectIntensity]);
  
  // Calculate dynamic brightness based on effects and brightness setting
  const dynamicBrightness = useMemo(() => {
    const baseBrightness = overallBrightness[0] / 100;
    const activeEffectsCount = Object.values(bridgedEffects).filter(
      effect => getEffectIntensity(effect) > 15
    ).length;
    
    // Boost brightness when multiple effects are active
    const effectBoost = activeEffectsCount > 0 ? 1 + (activeEffectsCount * 0.08) : 1;
    const result = Math.min(baseBrightness * effectBoost, 1.8);
    
    console.log('💡 Dynamic brightness calculation:', {
      baseBrightness,
      activeEffectsCount,
      effectBoost,
      result
    });
    
    return result;
  }, [overallBrightness, bridgedEffects, getEffectIntensity]);
  
  // Enhanced interactive lighting based on Studio settings
  const enhancedInteractiveLighting = useMemo(() => {
    const result = interactiveLighting && Object.keys(bridgedEffects).length > 0;
    console.log('🔦 Enhanced interactive lighting:', result);
    return result;
  }, [interactiveLighting, bridgedEffects]);
  
  const activeEffectsCount = Object.values(bridgedEffects).filter(
    effect => getEffectIntensity(effect) > 10
  ).length;
  
  console.log('📊 StudioEffectsBridge Summary:', {
    activeEffectsCount,
    dynamicBrightness,
    enhancedInteractiveLighting
  });
  
  return {
    bridgedEffects,
    dynamicBrightness,
    enhancedInteractiveLighting,
    activeEffectsCount
  };
};
