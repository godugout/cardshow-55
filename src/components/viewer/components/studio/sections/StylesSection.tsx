
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
  const statusText = selectedPresetId ? 
    selectedPresetId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 
    "Select Style";

  return (
    <CollapsibleSection
      title="Styles"
      emoji="🎨"
      statusText={statusText}
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
