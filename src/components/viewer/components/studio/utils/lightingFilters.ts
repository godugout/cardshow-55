
import { LIGHTING_PRESETS } from '../../../constants';
import type { LightingPreset, EnvironmentScene } from '../../../types';

// Define lighting preset compatibility metadata
const LIGHTING_METADATA = {
  // Environment-optimized presets
  'golden-hour': { 
    envCompatibility: ['sunset', 'outdoor', 'studio'], 
    wallpaperTypes: ['warm', 'gradient'],
    optimal: true 
  },
  'studio': { 
    envCompatibility: ['studio', 'gallery', 'neutral'], 
    wallpaperTypes: ['neutral', 'solid'],
    optimal: true 
  },
  'dramatic': { 
    envCompatibility: ['dark', 'moody', 'night'], 
    wallpaperTypes: ['dark', 'dramatic'],
    optimal: true 
  },
  'soft': { 
    envCompatibility: ['indoor', 'portrait', 'gentle'], 
    wallpaperTypes: ['soft', 'light'],
    optimal: true 
  },
  'neon': { 
    envCompatibility: ['cyberpunk', 'night', 'urban'], 
    wallpaperTypes: ['dark', 'vibrant'],
    optimal: true 
  },
  'natural': { 
    envCompatibility: ['outdoor', 'natural', 'daylight'], 
    wallpaperTypes: ['natural', 'earth'],
    optimal: true 
  },
  // Universal presets (work with everything)
  'default': { 
    envCompatibility: ['all'], 
    wallpaperTypes: ['all'],
    optimal: false 
  }
};

export function filterLightingPresetsForBackground(
  backgroundType: 'env' | 'wallpaper',
  selectedBackground: EnvironmentScene | string | null
): LightingPreset[] {
  if (!selectedBackground) {
    return LIGHTING_PRESETS;
  }

  const filteredPresets = LIGHTING_PRESETS.filter(preset => {
    const metadata = LIGHTING_METADATA[preset.id as keyof typeof LIGHTING_METADATA];
    if (!metadata) return true; // Include unknown presets

    if (backgroundType === 'env') {
      const envScene = selectedBackground as EnvironmentScene;
      return metadata.envCompatibility.includes('all') || 
             metadata.envCompatibility.some(env => 
               envScene.name.toLowerCase().includes(env) ||
               envScene.id.toLowerCase().includes(env)
             );
    } else {
      // For wallpapers, we could check wallpaper type if we had that data
      // For now, return all presets but prioritize certain ones
      return true;
    }
  });

  // Sort by optimality - optimal presets first
  return filteredPresets.sort((a, b) => {
    const aMetadata = LIGHTING_METADATA[a.id as keyof typeof LIGHTING_METADATA];
    const bMetadata = LIGHTING_METADATA[b.id as keyof typeof LIGHTING_METADATA];
    
    if (aMetadata?.optimal && !bMetadata?.optimal) return -1;
    if (!aMetadata?.optimal && bMetadata?.optimal) return 1;
    return 0;
  });
}

export function getLightingRecommendation(
  backgroundType: 'env' | 'wallpaper',
  selectedBackground: EnvironmentScene | string | null
): string {
  if (!selectedBackground) {
    return "Select a background to see lighting recommendations";
  }

  if (backgroundType === 'env') {
    const envScene = selectedBackground as EnvironmentScene;
    const sceneName = envScene.name.toLowerCase();
    
    if (sceneName.includes('sunset') || sceneName.includes('golden')) {
      return "Golden Hour lighting recommended for warm, natural tones";
    } else if (sceneName.includes('studio') || sceneName.includes('gallery')) {
      return "Studio lighting provides clean, professional illumination";
    } else if (sceneName.includes('night') || sceneName.includes('dark')) {
      return "Dramatic lighting enhances mood and contrast";
    } else if (sceneName.includes('cyber') || sceneName.includes('neon')) {
      return "Neon lighting complements futuristic environments";
    }
  }

  return "Experiment with different lighting to find your perfect match";
}
