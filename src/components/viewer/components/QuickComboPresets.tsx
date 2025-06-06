
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { COMBO_PRESETS } from './presets/comboPresets';
import { PresetItem } from './presets/PresetItem';
import { hasCustomEffects, createCustomPreset, getPresetSelection } from './presets/presetUtils';
import type { QuickComboPresetsProps } from './presets/types';

export const QuickComboPresets: React.FC<QuickComboPresetsProps> = ({ 
  onApplyCombo, 
  currentEffects, 
  selectedPresetId, 
  onPresetSelect,
  isApplyingPreset = false
}) => {
  // Enhanced preset application with better state management
  const handlePresetClick = (presetId: string, presetIndex: number) => {
    console.log('🎯 Enhanced Preset Selected:', { 
      presetId, 
      presetIndex,
      isApplying: isApplyingPreset 
    });
    
    // Prevent multiple simultaneous applications
    if (isApplyingPreset) {
      console.log('⚠️ Preset application blocked - already applying');
      return;
    }
    
    // Apply preset selection and combo atomically
    const selectedPreset = allPresets[presetIndex];
    onPresetSelect(selectedPreset.id);
    onApplyCombo(selectedPreset);
  };

  // Add custom preset if needed
  const allPresets = hasCustomEffects(currentEffects) 
    ? [...COMBO_PRESETS, createCustomPreset(currentEffects)] 
    : COMBO_PRESETS;

  return (
    <TooltipProvider>
      {allPresets.map((preset, index) => {
        const { isSelected, reason } = getPresetSelection(
          preset, 
          selectedPresetId, 
          isApplyingPreset,
          currentEffects
        );
        
        console.log(`🎯 Preset ${preset.id}:`, { isSelected, reason, selectedPresetId });
        
        return (
          <PresetItem
            key={preset.id}
            preset={preset}
            isSelected={isSelected}
            isApplying={isApplyingPreset}
            detectionReason={reason !== 'none' ? reason : undefined}
            onClick={() => handlePresetClick(preset.id, index)}
          />
        );
      })}
    </TooltipProvider>
  );
};
