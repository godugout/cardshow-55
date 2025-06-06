
import React from 'react';
import { EnhancedQuickComboPresets } from '../../EnhancedQuickComboPresets';
import type { EffectValues } from '../../../hooks/useEnhancedCardEffects';

interface StylesSectionProps {
  effectValues: EffectValues;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  onApplyCombo: (combo: any) => void;
  isApplyingPreset?: boolean;
}

export const StylesSection: React.FC<StylesSectionProps> = ({
  effectValues,
  selectedPresetId,
  onPresetSelect,
  onApplyCombo,
  isApplyingPreset = false
}) => {
  return (
    <div>
      <EnhancedQuickComboPresets
        onApplyCombo={onApplyCombo}
        currentEffects={effectValues}
        selectedPresetId={selectedPresetId}
        onPresetSelect={onPresetSelect}
        isApplyingPreset={isApplyingPreset}
      />
    </div>
  );
};
