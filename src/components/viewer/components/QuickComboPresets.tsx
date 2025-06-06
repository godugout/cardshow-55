
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, Zap, Gem, Clock, Flame, Snowflake, Sun, Moon, Star, User } from 'lucide-react';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset } from '../types';

interface ComboPreset {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  effects: EffectValues;
  scene?: EnvironmentScene;
  lighting?: LightingPreset;
  isCustom?: boolean;
  materialHint?: string;
}

const COMBO_PRESETS: ComboPreset[] = [
  {
    id: 'holographic-burst',
    name: 'Holographic',
    icon: Sparkles,
    description: 'Rainbow holographic with chrome accents',
    materialHint: 'Deep blue holographic surface',
    effects: {
      holographic: { intensity: 85, shiftSpeed: 150, rainbowSpread: 270, animated: true },
      chrome: { intensity: 45, sharpness: 80, highlightSize: 60 }
    }
  },
  {
    id: 'metallic-prizm',
    name: 'Prizm',
    icon: Gem,
    description: 'Subtle spectrum film with balanced color',
    materialHint: 'Delicate spectrum film over card surface',
    effects: {
      prizm: { intensity: 40, complexity: 4, colorSeparation: 60 },
      brushedmetal: { intensity: 25, direction: 45, grainDensity: 8 }
    }
  },
  {
    id: 'crystal-interference',
    name: 'Crystal',
    icon: Zap,
    description: 'Crystal facets with soap bubble effects',
    materialHint: 'Translucent crystal surface with light dispersion',
    effects: {
      crystal: { intensity: 80, facets: 12, dispersion: 85, clarity: 60, sparkle: true },
      interference: { intensity: 60, frequency: 15, thickness: 4 }
    }
  },
  {
    id: 'vintage-foil',
    name: 'Vintage',
    icon: Clock,
    description: 'Aged patina with metallic foil spray',
    materialHint: 'Weathered surface with vintage texture',
    effects: {
      vintage: { intensity: 65, aging: 70, patina: '#8b6914' },
      foilspray: { intensity: 50, density: 60, direction: 90 }
    }
  },
  {
    id: 'golden-fire',
    name: 'Golden',
    icon: Flame,
    description: 'Warm gold tones with chromatic shift',
    materialHint: 'Rich golden surface with warm reflections',
    effects: {
      gold: { intensity: 75, shimmerSpeed: 80, platingThickness: 5, goldTone: 'rich', reflectivity: 85, colorEnhancement: true },
      chrome: { intensity: 40, sharpness: 60, highlightSize: 50 }
    }
  },
  {
    id: 'ice-crystal',
    name: 'Ice',
    icon: Snowflake,
    description: 'Cool crystal with silver highlights',
    materialHint: 'Frosted crystal surface with silver accents',
    effects: {
      crystal: { intensity: 70, facets: 8, dispersion: 70, clarity: 60, sparkle: true },
      chrome: { intensity: 35, sharpness: 90, highlightSize: 40 }
    }
  },
  {
    id: 'solar-flare',
    name: 'Solar',
    icon: Sun,
    description: 'Aurora-like effect with solar flares',
    materialHint: 'Shimmering aurora with vibrant blue-green waves',
    effects: {
      gold: { intensity: 70, shimmerSpeed: 120, goldTone: 'solar', reflectivity: 80, platingThickness: 3, colorEnhancement: true },
      interference: { intensity: 35, frequency: 8, thickness: 2 }
    }
  },
  {
    id: 'lunar-shimmer',
    name: 'Lunar',
    icon: Moon,
    description: 'Subtle interference with vintage charm',
    materialHint: 'Soft silvery surface with gentle interference patterns',
    effects: {
      interference: { intensity: 45, frequency: 12, thickness: 3 },
      vintage: { intensity: 35, aging: 40, patina: '#c0c0c0' }
    }
  },
  {
    id: 'starlight-spray',
    name: 'Starlight',
    icon: Star,
    description: 'Sparkling foil spray with prismatic edge',
    materialHint: 'Metallic chrome surface with sparkling highlights',
    effects: {
      foilspray: { intensity: 65, density: 80, direction: 135 },
      prizm: { intensity: 35, complexity: 4, colorSeparation: 50 }
    }
  },
  {
    id: 'chrome-burst',
    name: 'Chrome',
    icon: Zap,
    description: 'Pure chrome with brushed metal finish',
    materialHint: 'Polished chrome surface with directional brushing',
    effects: {
      chrome: { intensity: 80, sharpness: 95, highlightSize: 70 },
      brushedmetal: { intensity: 40, direction: 90, grainDensity: 8 }
    }
  }
];

interface QuickComboPresetsProps {
  onApplyCombo: (combo: ComboPreset) => void;
  currentEffects: EffectValues;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  isApplyingPreset?: boolean;
}

export const QuickComboPresets: React.FC<QuickComboPresetsProps> = ({ 
  onApplyCombo, 
  currentEffects, 
  selectedPresetId, 
  onPresetSelect,
  isApplyingPreset = false
}) => {
  // Enhanced effect matching with progressive tolerance
  const effectsMatchPreset = (presetEffects: EffectValues, currentEffects: EffectValues): boolean => {
    console.log('🔍 Checking preset match:', { presetEffects, currentEffects });
    
    const presetKeys = Object.keys(presetEffects);
    const currentActiveKeys = Object.keys(currentEffects).filter(key => {
      const effect = currentEffects[key];
      return effect && typeof effect.intensity === 'number' && effect.intensity > 5; // Increased threshold
    });

    // Allow for flexible matching - don't require exact effect count
    const hasMainPresetEffects = presetKeys.every(key => {
      const preset = presetEffects[key];
      const current = currentEffects[key];
      if (!current || !preset) return false;
      
      const presetIntensity = typeof preset.intensity === 'number' ? preset.intensity : 0;
      const currentIntensity = typeof current.intensity === 'number' ? current.intensity : 0;
      
      // More tolerant intensity matching with progressive tolerance
      const tolerance = Math.max(10, presetIntensity * 0.2); // 20% tolerance or minimum 10
      const intensityMatch = Math.abs(currentIntensity - presetIntensity) <= tolerance;
      
      if (!intensityMatch) {
        console.log(`❌ Intensity mismatch for ${key}:`, { preset: presetIntensity, current: currentIntensity, tolerance });
        return false;
      }
      
      // Check other parameters with increased tolerance
      const paramsMatch = Object.keys(preset).every(paramKey => {
        if (paramKey === 'intensity') return true;
        const presetVal = preset[paramKey];
        const currentVal = current[paramKey];
        
        if (typeof presetVal === 'number' && typeof currentVal === 'number') {
          const paramTolerance = Math.max(8, presetVal * 0.25); // 25% tolerance
          return Math.abs(currentVal - presetVal) <= paramTolerance;
        }
        return presetVal === currentVal;
      });
      
      console.log(`${paramsMatch ? '✅' : '❌'} Parameters match for ${key}:`, paramsMatch);
      return paramsMatch;
    });

    console.log('📊 Final match result:', hasMainPresetEffects);
    return hasMainPresetEffects;
  };

  // Detect custom effects with improved logic
  const hasCustomEffects = (): boolean => {
    const hasActiveEffects = Object.values(currentEffects).some(effect => 
      effect && typeof effect.intensity === 'number' && effect.intensity > 5
    );
    
    if (!hasActiveEffects) return false;
    
    // Check if current effects match any existing preset
    const matchesExistingPreset = COMBO_PRESETS.some(preset => effectsMatchPreset(preset.effects, currentEffects));
    
    console.log('🎨 Custom effects check:', { hasActiveEffects, matchesExistingPreset });
    return !matchesExistingPreset;
  };

  // Enhanced custom preset creation
  const createCustomPreset = (): ComboPreset => {
    const activeEffects = Object.keys(currentEffects).filter(key => {
      const effect = currentEffects[key];
      return effect && typeof effect.intensity === 'number' && effect.intensity > 5;
    });
    
    const description = `Custom blend: ${activeEffects.join(', ')}`;
    
    return {
      id: 'user-custom',
      name: "Your Style",
      icon: User,
      description,
      effects: currentEffects,
      isCustom: true
    };
  };

  const allPresets = hasCustomEffects() ? [...COMBO_PRESETS, createCustomPreset()] : COMBO_PRESETS;

  // Enhanced preset application with better state management
  const handlePresetClick = (preset: ComboPreset) => {
    console.log('🎯 Enhanced Preset Selected:', { 
      presetId: preset.id, 
      effects: preset.effects,
      isApplying: isApplyingPreset 
    });
    
    // Prevent multiple simultaneous applications
    if (isApplyingPreset) {
      console.log('⚠️ Preset application blocked - already applying');
      return;
    }
    
    // Apply preset selection and combo atomically
    onPresetSelect(preset.id);
    onApplyCombo(preset);
  };

  // Determine selection with improved logic
  const getPresetSelection = (preset: ComboPreset) => {
    // Priority 1: Explicit selection during application
    if (isApplyingPreset && selectedPresetId === preset.id) {
      return { isSelected: true, reason: 'applying' };
    }
    
    // Priority 2: Stable selection from state
    if (selectedPresetId === preset.id) {
      return { isSelected: true, reason: 'selected' };
    }
    
    // Priority 3: Auto-detection (only if no explicit selection)
    if (!selectedPresetId && effectsMatchPreset(preset.effects, currentEffects)) {
      return { isSelected: true, reason: 'auto-detected' };
    }
    
    return { isSelected: false, reason: 'none' };
  };

  return (
    <TooltipProvider>
      {allPresets.map((preset) => {
        const IconComponent = preset.icon;
        const { isSelected, reason } = getPresetSelection(preset);
        
        console.log(`🎯 Preset ${preset.id}:`, { isSelected, reason, selectedPresetId });
        
        return (
          <Tooltip key={preset.id}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => handlePresetClick(preset)}
                disabled={isApplyingPreset && selectedPresetId !== preset.id}
                variant="ghost"
                className={`w-full h-7 px-2 flex items-center justify-start space-x-2 border transition-colors ${
                  isSelected 
                    ? 'bg-crd-green/30 border-crd-green text-white shadow-md' 
                    : 'bg-editor-dark border-editor-border hover:border-crd-green hover:bg-crd-green/20'
                } text-xs ${isApplyingPreset && selectedPresetId !== preset.id ? 'opacity-30' : ''}`}
              >
                <IconComponent className={`w-3 h-3 flex-shrink-0 ${
                  isSelected ? 'text-crd-green' : 'text-crd-green'
                }`} />
                <span className={`font-medium truncate ${
                  preset.isCustom ? 'text-crd-green' : 'text-white'
                }`}>
                  {preset.name}
                </span>
                {isApplyingPreset && isSelected && (
                  <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse ml-auto" />
                )}
                {isSelected && reason === 'auto-detected' && (
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full ml-auto" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black border-gray-700 text-white z-50">
              <div className="text-center max-w-48">
                <div className="font-medium">{preset.name}</div>
                <div className="text-xs text-gray-300 mb-1">{preset.description}</div>
                {preset.materialHint && (
                  <div className="text-xs text-crd-green italic">
                    Surface: {preset.materialHint}
                  </div>
                )}
                {isSelected && (
                  <div className="text-xs text-blue-400 mt-1">
                    {reason === 'applying' ? 'Applying...' : 
                     reason === 'selected' ? 'Selected' : 
                     'Auto-detected'}
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </TooltipProvider>
  );
};
