
import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { EnhancedQuickComboPresets } from '../../EnhancedQuickComboPresets';
import type { EffectValues } from '../../../hooks/useEnhancedCardEffects';

interface StylesSectionProps {
  effectValues: EffectValues;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  onApplyCombo: (combo: any) => void;
  isApplyingPreset?: boolean;
}

export const StylesSection: React.FC<StylesSectionProps> = ({
  effectValues,
  isOpen,
  onToggle,
  selectedPresetId,
  onPresetSelect,
  onApplyCombo,
  isApplyingPreset = false
}) => {
  return (
    <CollapsibleSection
      title="Styles"
      emoji="🎨"
      statusText={selectedPresetId ? "Custom Preset" : "Quick Presets"}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <EnhancedQuickComboPresets
        onApplyCombo={onApplyCombo}
        currentEffects={effectValues}
        selectedPresetId={selectedPresetId}
        onPresetSelect={onPresetSelect}
        isApplyingPreset={isApplyingPreset}
      />
    </CollapsibleSection>
  );
};
