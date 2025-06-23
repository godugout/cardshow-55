
import { useState, useCallback, useRef } from 'react';
import type { EffectValues } from './types';

interface PresetState {
  isApplying: boolean;
  appliedAt: number;
  currentPresetId?: string;
  isLocked: boolean;
  sequenceId: string;
}

export const usePresetApplication = () => {
  const [presetState, setPresetState] = useState<PresetState>({
    isApplying: false,
    appliedAt: 0,
    isLocked: false,
    sequenceId: ''
  });

  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();
  }, []);

  const applyPreset = useCallback((
    preset: EffectValues, 
    setEffectValues: (values: EffectValues) => void,
    presetId?: string
  ) => {
    const sequenceId = `preset-${Date.now()}`;
    
    setPresetState({
      isApplying: true,
      appliedAt: Date.now(),
      currentPresetId: presetId,
      isLocked: true,
      sequenceId
    });

    // Clear any existing timeouts
    clearTimeouts();

    // Apply the preset values
    setEffectValues(preset);

    // Unlock after a short delay to prevent immediate manual overrides
    const unlockTimeout = setTimeout(() => {
      setPresetState(prev => ({
        ...prev,
        isApplying: false,
        isLocked: false
      }));
    }, 1000);

    timeoutsRef.current.add(unlockTimeout);
  }, [clearTimeouts]);

  return {
    presetState,
    setPresetState,
    applyPreset,
    isApplyingPreset: presetState.isApplying,
    clearTimeouts
  };
};
