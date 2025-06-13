
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../../types';

export interface Material3DProperties {
  metalness: number;
  roughness: number;
  emissiveIntensity: number;
  emissiveColor: string;
  opacity: number;
  reflectivity: number;
  clearcoat: number;
  clearcoatRoughness: number;
}

export const mapEffectsTo3DMaterials = (
  effectValues: EffectValues,
  selectedLighting: LightingPreset,
  materialSettings: MaterialSettings
): Material3DProperties => {
  // Base material properties
  let properties: Material3DProperties = {
    metalness: 0.1,
    roughness: 0.3,
    emissiveIntensity: 0,
    emissiveColor: '#000000',
    opacity: 1,
    reflectivity: 0.5,
    clearcoat: 0,
    clearcoatRoughness: 0.1
  };

  // Map holographic effects
  if (effectValues.holographic && typeof effectValues.holographic.intensity === 'number') {
    const intensity = effectValues.holographic.intensity;
    properties.metalness = Math.min(0.9, 0.1 + intensity * 0.8);
    properties.roughness = Math.max(0.1, 0.3 - intensity * 0.2);
    properties.emissiveIntensity = intensity * 0.3;
    properties.emissiveColor = '#004444';
    properties.clearcoat = intensity * 0.8;
  }

  // Map chrome effects
  if (effectValues.chrome && typeof effectValues.chrome.intensity === 'number') {
    const intensity = effectValues.chrome.intensity;
    properties.metalness = Math.min(0.95, 0.1 + intensity * 0.85);
    properties.roughness = Math.max(0.05, 0.3 - intensity * 0.25);
    properties.reflectivity = Math.min(1.0, 0.5 + intensity * 0.5);
  }

  // Map foil effects
  if (effectValues.foil && typeof effectValues.foil.intensity === 'number') {
    const intensity = effectValues.foil.intensity;
    properties.emissiveIntensity = Math.max(properties.emissiveIntensity, intensity * 0.4);
    properties.emissiveColor = '#ff2266';
    properties.clearcoat = Math.max(properties.clearcoat, intensity * 0.6);
  }

  // Map gold effects
  if (effectValues.gold && typeof effectValues.gold.intensity === 'number') {
    const intensity = effectValues.gold.intensity;
    properties.metalness = Math.min(0.9, 0.1 + intensity * 0.8);
    properties.emissiveIntensity = Math.max(properties.emissiveIntensity, intensity * 0.2);
    properties.emissiveColor = '#ffd700';
  }

  // Apply material settings overrides
  if (materialSettings) {
    if (typeof materialSettings.metalness === 'number') {
      properties.metalness = materialSettings.metalness;
    }
    if (typeof materialSettings.roughness === 'number') {
      properties.roughness = materialSettings.roughness;
    }
  }

  return properties;
};

export const mapLightingTo3D = (selectedLighting: LightingPreset) => {
  const lightingData = selectedLighting as any;
  
  return {
    mainLightColor: lightingData?.color || '#ffffff',
    mainLightIntensity: lightingData?.intensity || 0.8,
    ambientColor: lightingData?.ambientColor || '#404040',
    ambientIntensity: lightingData?.ambientIntensity || 0.3,
    accentColor: lightingData?.accentColor || '#4444ff',
    accentIntensity: 0.4
  };
};
