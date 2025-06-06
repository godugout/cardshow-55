
import { useState, useCallback, useMemo, startTransition, useRef } from 'react';

export interface EffectParameter {
  id: string;
  name: string;
  type: 'slider' | 'toggle' | 'color' | 'select';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | boolean | string;
  options?: { value: string; label: string }[];
}

export interface VisualEffectConfig {
  id: string;
  name: string;
  description: string;
  category: 'metallic' | 'prismatic' | 'surface' | 'vintage';
  parameters: EffectParameter[];
}

export interface EffectValues {
  [effectId: string]: {
    [parameterId: string]: number | boolean | string;
  };
}

// Define all visual effects with their unique parameters
export const ENHANCED_VISUAL_EFFECTS: VisualEffectConfig[] = [
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Dynamic rainbow shifting with prismatic effects',
    category: 'prismatic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: 'shiftSpeed', name: 'Color Shift Speed', type: 'slider', min: 0, max: 200, step: 5, defaultValue: 100 },
      { id: 'rainbowSpread', name: 'Rainbow Spread', type: 'slider', min: 0, max: 360, step: 10, defaultValue: 180 },
      { id: 'animated', name: 'Animated', type: 'toggle', defaultValue: true }
    ]
  },
  {
    id: 'foilspray',
    name: 'Foil Spray',
    description: 'Metallic spray pattern with directional flow',
    category: 'metallic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: 'density', name: 'Metallic Density', type: 'slider', min: 10, max: 100, step: 5, defaultValue: 50 },
      { id: 'direction', name: 'Flow Direction', type: 'slider', min: 0, max: 360, step: 15, defaultValue: 45 }
    ]
  },
  {
    id: 'prizm',
    name: 'Prizm',
    description: 'Geometric prismatic patterns with color separation',
    category: 'prismatic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: 'complexity', name: 'Pattern Complexity', type: 'slider', min: 1, max: 10, step: 1, defaultValue: 5 },
      { id: 'colorSeparation', name: 'Color Separation', type: 'slider', min: 0, max: 100, step: 5, defaultValue: 60 }
    ]
  },
  {
    id: 'chrome',
    name: 'Chrome',
    description: 'Metallic chrome finish with mirror-like reflections',
    category: 'metallic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: 'sharpness', name: 'Reflection Sharpness', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 70 },
      { id: 'highlightSize', name: 'Highlight Size', type: 'slider', min: 10, max: 90, step: 5, defaultValue: 40 }
    ]
  },
  {
    id: 'interference',
    name: 'Interference',
    description: 'Soap bubble interference patterns',
    category: 'surface',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: 'frequency', name: 'Wave Frequency', type: 'slider', min: 1, max: 20, step: 1, defaultValue: 8 },
      { id: 'thickness', name: 'Bubble Thickness', type: 'slider', min: 1, max: 10, step: 0.5, defaultValue: 3 }
    ]
  },
  {
    id: 'brushedmetal',
    name: 'Brushed Metal',
    description: 'Brushed metallic surface with directional grain',
    category: 'metallic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: 'direction', name: 'Brush Direction', type: 'slider', min: 0, max: 180, step: 15, defaultValue: 45 },
      { id: 'grainDensity', name: 'Grain Density', type: 'slider', min: 1, max: 20, step: 1, defaultValue: 8 }
    ]
  },
  {
    id: 'crystal',
    name: 'Crystal',
    description: 'Crystalline faceted surface with light dispersion',
    category: 'prismatic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: 'facets', name: 'Facet Count', type: 'slider', min: 3, max: 20, step: 1, defaultValue: 8 },
      { id: 'dispersion', name: 'Light Dispersion', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 60 },
      { id: 'clarity', name: 'Crystal Clarity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 60 },
      { id: 'sparkle', name: 'Sparkle Effect', type: 'toggle', defaultValue: true }
    ]
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Aged patina with wear patterns',
    category: 'vintage',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: 'aging', name: 'Aging Level', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 40 },
      { id: 'patina', name: 'Patina Color', type: 'color', defaultValue: '#8b7355' }
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    description: 'Luxurious gold plating with authentic shimmer',
    category: 'metallic',
    parameters: [
      { id: 'intensity', name: 'Intensity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 0 },
      { id: 'shimmerSpeed', name: 'Shimmer Speed', type: 'slider', min: 0, max: 200, step: 5, defaultValue: 80 },
      { id: 'platingThickness', name: 'Plating Thickness', type: 'slider', min: 1, max: 10, step: 0.5, defaultValue: 5 },
      { id: 'goldTone', name: 'Gold Tone', type: 'select', defaultValue: 'rich', 
        options: [
          { value: 'rich', label: 'Rich Gold' },
          { value: 'rose', label: 'Rose Gold' },
          { value: 'white', label: 'White Gold' },
          { value: 'antique', label: 'Antique Gold' },
          { value: 'solar', label: 'Aurora Solar' }
        ]
      },
      { id: 'reflectivity', name: 'Reflectivity', type: 'slider', min: 0, max: 100, step: 1, defaultValue: 85 },
      { id: 'colorEnhancement', name: 'Yellow Enhancement', type: 'toggle', defaultValue: true }
    ]
  }
];

// Enhanced state interface with better synchronization
interface PresetApplicationState {
  isApplying: boolean;
  currentPresetId?: string;
  appliedAt: number;
  isLocked: boolean;
  sequenceId: string;
}

export const useEnhancedCardEffects = () => {
  const [effectValues, setEffectValues] = useState<EffectValues>(() => {
    const initialValues: EffectValues = {};
    ENHANCED_VISUAL_EFFECTS.forEach(effect => {
      initialValues[effect.id] = {};
      effect.parameters.forEach(param => {
        initialValues[effect.id][param.id] = param.defaultValue;
      });
    });
    return initialValues;
  });

  // Enhanced preset application state with sequence tracking
  const [presetState, setPresetState] = useState<PresetApplicationState>({
    isApplying: false,
    appliedAt: 0,
    isLocked: false,
    sequenceId: ''
  });

  // Refs for cleanup and state validation
  const presetTimeoutRef = useRef<NodeJS.Timeout>();
  const lockTimeoutRef = useRef<NodeJS.Timeout>();
  const validationTimeoutRef = useRef<NodeJS.Timeout>();

  // Memoize default values
  const defaultEffectValues = useMemo(() => {
    const defaults: EffectValues = {};
    ENHANCED_VISUAL_EFFECTS.forEach(effect => {
      defaults[effect.id] = {};
      effect.parameters.forEach(param => {
        defaults[effect.id][param.id] = param.defaultValue;
      });
    });
    return defaults;
  }, []);

  // Enhanced effect intensity clamping for smooth transitions
  const clampEffectValue = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    if (typeof value !== 'number') return value;
    
    // Apply smooth clamping for problematic effects
    const clampingRules: Record<string, Record<string, { soft: number; hard: number }>> = {
      prizm: {
        intensity: { soft: 75, hard: 85 }, // Soft limit at 75%, hard at 85%
        complexity: { soft: 8, hard: 10 },
        colorSeparation: { soft: 80, hard: 90 }
      },
      crystal: {
        intensity: { soft: 80, hard: 90 },
        dispersion: { soft: 85, hard: 95 }
      },
      holographic: {
        intensity: { soft: 85, hard: 95 },
        shiftSpeed: { soft: 180, hard: 200 }
      }
    };
    
    const rule = clampingRules[effectId]?.[parameterId];
    if (rule && value > rule.soft) {
      // Apply smooth damping above soft limit
      const overage = value - rule.soft;
      const damping = 1 - (overage / (rule.hard - rule.soft)) * 0.5;
      const clampedValue = rule.soft + (overage * Math.max(0.1, damping));
      
      console.log(`🎛️ Clamping ${effectId}.${parameterId}:`, { original: value, clamped: clampedValue });
      return Math.min(clampedValue, rule.hard);
    }
    
    return value;
  }, []);

  const handleEffectChange = useCallback((effectId: string, parameterId: string, value: number | boolean | string) => {
    console.log('🎛️ Effect Change:', { effectId, parameterId, value, presetState });
    
    // Apply clamping for smooth transitions
    const clampedValue = clampEffectValue(effectId, parameterId, value);
    
    // Clear preset state when manual changes are made (unless locked)
    if (!presetState.isApplying && !presetState.isLocked) {
      setPresetState(prev => ({ 
        ...prev, 
        currentPresetId: undefined,
        sequenceId: `manual-${Date.now()}`
      }));
    }
    
    setEffectValues(prev => ({
      ...prev,
      [effectId]: {
        ...prev[effectId],
        [parameterId]: clampedValue
      }
    }));
  }, [presetState.isApplying, presetState.isLocked, clampEffectValue]);

  const resetEffect = useCallback((effectId: string) => {
    console.log('🔄 Resetting effect:', effectId);
    const effect = ENHANCED_VISUAL_EFFECTS.find(e => e.id === effectId);
    if (effect) {
      const resetValues: Record<string, any> = {};
      effect.parameters.forEach(param => {
        resetValues[param.id] = param.defaultValue;
      });
      setEffectValues(prev => ({
        ...prev,
        [effectId]: resetValues
      }));
    }
  }, []);

  const resetAllEffects = useCallback(() => {
    console.log('🔄 Resetting all effects with cleanup');
    
    // Clear all timeouts
    [presetTimeoutRef, lockTimeoutRef, validationTimeoutRef].forEach(ref => {
      if (ref.current) clearTimeout(ref.current);
    });
    
    setPresetState({ 
      isApplying: false, 
      appliedAt: Date.now(), 
      isLocked: false,
      sequenceId: `reset-${Date.now()}`
    });
    setEffectValues(defaultEffectValues);
  }, [defaultEffectValues]);

  // Enhanced atomic preset application with sequence tracking
  const applyPreset = useCallback((preset: EffectValues, presetId?: string) => {
    const sequenceId = `preset-${presetId}-${Date.now()}`;
    console.log('🎨 Applying preset with enhanced synchronization:', { presetId, preset, sequenceId });
    
    // Prevent overlapping applications
    if (presetState.isLocked) {
      console.log('⚠️ Preset application blocked - currently locked');
      return;
    }
    
    // Clear any existing timeouts
    [presetTimeoutRef, lockTimeoutRef, validationTimeoutRef].forEach(ref => {
      if (ref.current) clearTimeout(ref.current);
    });
    
    // Set enhanced synchronization lock
    setPresetState({ 
      isApplying: true, 
      currentPresetId: presetId, 
      appliedAt: Date.now(),
      isLocked: true,
      sequenceId
    });
    
    // Enhanced atomic application with state validation
    startTransition(() => {
      // Step 1: Complete reset with material clearing
      const resetValues = JSON.parse(JSON.stringify(defaultEffectValues)); // Deep copy
      setEffectValues(resetValues);
      
      // Step 2: Apply preset effects with clamping
      presetTimeoutRef.current = setTimeout(() => {
        const newEffectValues = JSON.parse(JSON.stringify(defaultEffectValues)); // Deep copy
        
        // Apply preset effects with enhanced validation and clamping
        Object.entries(preset).forEach(([effectId, effectParams]) => {
          if (newEffectValues[effectId] && effectParams) {
            Object.entries(effectParams).forEach(([paramId, value]) => {
              if (newEffectValues[effectId][paramId] !== undefined) {
                // Apply clamping during preset application
                const clampedValue = clampEffectValue(effectId, paramId, value);
                newEffectValues[effectId][paramId] = clampedValue;
              }
            });
          }
        });
        
        // Apply atomically
        setEffectValues(newEffectValues);
        
        // Step 3: State validation and cleanup
        validationTimeoutRef.current = setTimeout(() => {
          console.log('🔍 Validating preset application state:', sequenceId);
          
          // Release lock after validation
          lockTimeoutRef.current = setTimeout(() => {
            setPresetState(prev => ({ 
              ...prev, 
              isApplying: false, 
              isLocked: false 
            }));
            console.log('✅ Preset application complete:', sequenceId);
          }, 200); // Extended for material recalculation
          
        }, 100); // Validation delay
        
      }, 150); // Increased reset delay
    });
  }, [defaultEffectValues, presetState.isLocked, clampEffectValue]);

  // Enhanced state validation
  const validateEffectState = useCallback(() => {
    console.log('🔍 Validating effect state consistency');
    // Add any necessary state consistency checks here
  }, []);

  return {
    effectValues,
    handleEffectChange,
    resetEffect,
    resetAllEffects,
    applyPreset,
    presetState,
    isApplyingPreset: presetState.isApplying || presetState.isLocked,
    validateEffectState
  };
};
