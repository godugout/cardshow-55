
import { useState, useCallback, useEffect } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import { ENVIRONMENT_SCENES, LIGHTING_PRESETS } from '../constants';

interface StudioEffectsState {
  effectValues: EffectValues;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number;
  interactiveLighting: boolean;
}

export const useStudioEffectsBridge = (
  initialEffects: EffectValues = {},
  selectedScene?: EnvironmentScene,
  selectedLighting?: LightingPreset,
  materialSettings?: MaterialSettings,
  overallBrightness?: number,
  interactiveLighting?: boolean
) => {
  const [studioState, setStudioState] = useState<StudioEffectsState>({
    effectValues: initialEffects,
    selectedScene: selectedScene || ENVIRONMENT_SCENES[0],
    selectedLighting: selectedLighting || LIGHTING_PRESETS[0],
    materialSettings: materialSettings || {
      metalness: 0.5,
      roughness: 0.5,
      reflectivity: 0.5,
      clearcoat: 0.3
    },
    overallBrightness: overallBrightness || 100,
    interactiveLighting: interactiveLighting ?? true
  });

  // Convert studio settings to card effects
  const convertToCardEffects = useCallback((state: StudioEffectsState): EffectValues => {
    const effects: EffectValues = { ...state.effectValues };

    // Apply environment-based effects
    switch (state.selectedScene.id) {
      case 'cosmic':
        effects.holographic = { 
          intensity: 75, 
          enabled: true,
          rainbowIntensity: 0.8,
          shiftSpeed: 0.5
        };
        break;
      case 'golden':
        effects.gold = { 
          intensity: 80, 
          enabled: true,
          goldTone: 'classic',
          warmth: 0.9
        };
        break;
      case 'arctic':
        effects.crystal = { 
          intensity: 70, 
          enabled: true,
          clarity: 0.95,
          sparkleIntensity: 0.8
        };
        break;
      case 'volcanic':
        effects.chrome = { 
          intensity: 85, 
          enabled: true,
          reflectivity: 0.9,
          temperature: 'warm'
        };
        break;
    }

    // Apply lighting-based effects
    if (state.selectedLighting.id === 'dramatic') {
      effects.interference = { 
        intensity: 60, 
        enabled: true,
        pattern: 'diagonal',
        speed: 0.3
      };
    }

    // Apply brightness adjustments
    Object.keys(effects).forEach(effectKey => {
      const effect = effects[effectKey];
      if (effect && typeof effect === 'object' && 'intensity' in effect) {
        const currentIntensity = typeof effect.intensity === 'number' ? effect.intensity : 50;
        effect.intensity = Math.round(currentIntensity * (state.overallBrightness / 100));
      }
    });

    return effects;
  }, []);

  const updateStudioEffect = useCallback((key: keyof StudioEffectsState, value: any) => {
    setStudioState(prev => ({ ...prev, [key]: value }));
  }, []);

  const cardEffects = convertToCardEffects(studioState);

  return {
    studioState,
    cardEffects,
    updateStudioEffect
  };
};
