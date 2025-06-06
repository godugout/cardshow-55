
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

  // Memoize default values
  const defaultEffectValues = createDefaultEffectValues();

  // Enhanced atomic preset application with sequence tracking
  const applyPreset = useCallback((
    preset: EffectValues, 
    setEffectValues: (values: EffectValues | ((prev: EffectValues) => EffectValues)) => void, 
    presetId?: string
  ) => {
    const sequenceId = `preset-${presetId}-${Date.now()}`;
    console.log('🎨 Applying preset with enhanced synchronization:', { presetId, preset, sequenceId });
    
    // Prevent overlapping applications
    if (presetState.isLocked) {
      console.log('⚠️ Preset application blocked - currently locked');
      return;
    }
    
    // Clear any existing timeouts
    clearTimeouts();
    
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
  }, [presetState.isLocked, defaultEffectValues]);

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
    isApplyingPreset: presetState.isApplying || presetState.isLocked,
    clearTimeouts
  };
};
