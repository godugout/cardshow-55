
import { useState, useCallback, useRef } from 'react';
import { startTransition } from 'react';
import { createDefaultEffectValues } from './effectUtils';
import { clampEffectValue } from './effectUtils';
import type { EffectValues, PresetApplicationState } from './types';

export const usePresetApplication = () => {
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

  // Memoize default values with initial effect for card back visibility
  const defaultEffectValues = createDefaultEffectValues();

  // Enhanced direct effect merging without disruptive reset
  const applyPreset = useCallback((
    preset: EffectValues, 
    setEffectValues: (values: EffectValues | ((prev: EffectValues) => EffectValues)) => void, 
    presetId?: string
  ) => {
    const sequenceId = `preset-${presetId}-${Date.now()}`;
    console.log('🎨 Applying preset with direct merging (no reset):', { presetId, preset, sequenceId });
    
    // Prevent overlapping applications
    if (presetState.isLocked) {
      console.log('⚠️ Preset application blocked - currently locked');
      return;
    }
    
    // Clear any existing timeouts
    clearTimeouts();
    
    // Set application state without disruptive locking
    setPresetState({ 
      isApplying: true, 
      currentPresetId: presetId, 
      appliedAt: Date.now(),
      isLocked: false, // Don't lock to prevent state conflicts
      sequenceId
    });
    
    // Direct effect merging without reset
    startTransition(() => {
      setEffectValues(currentValues => {
        // Start with current values to maintain base effects
        const newEffectValues = { ...currentValues };
        
        // Merge preset effects with enhanced validation and clamping
        Object.entries(preset).forEach(([effectId, effectParams]) => {
          if (effectParams) {
            // Initialize effect if it doesn't exist
            if (!newEffectValues[effectId]) {
              newEffectValues[effectId] = {};
            }
            
            // Merge parameters
            Object.entries(effectParams).forEach(([paramId, value]) => {
              const clampedValue = clampEffectValue(effectId, paramId, value);
              newEffectValues[effectId][paramId] = clampedValue;
            });
          }
        });
        
        console.log('✅ Direct effect merge complete:', newEffectValues);
        return newEffectValues;
      });
      
      // Complete application after brief transition
      presetTimeoutRef.current = setTimeout(() => {
        setPresetState(prev => ({ 
          ...prev, 
          isApplying: false 
        }));
        console.log('✅ Preset application complete:', sequenceId);
      }, 100); // Reduced timeout for faster response
    });
  }, [presetState.isLocked]);

  // Clear all timeouts for cleanup
  const clearTimeouts = useCallback(() => {
    if (presetTimeoutRef.current) clearTimeout(presetTimeoutRef.current);
    if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    if (validationTimeoutRef.current) clearTimeout(validationTimeoutRef.current);
  }, []);

  return {
    presetState,
    applyPreset,
    setPresetState,
    isApplyingPreset: presetState.isApplying,
    clearTimeouts
  };
};
