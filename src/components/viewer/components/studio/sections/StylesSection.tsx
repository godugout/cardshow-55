
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
  const statusText = selectedPresetId && selectedPresetId !== 'custom-init' ? 
    selectedPresetId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 
    "Select Style";

  const handleComboClick = (combo: any) => {
    console.log('🎨 StylesSection: Combo clicked:', combo.id, combo.effects);
    
    // First set the selected preset
    onPresetSelect(combo.id);
    
    // Then apply the combo effects
    onApplyCombo(combo);
  };

  return (
    <CollapsibleSection
      title="Styles"
      emoji="🎨"
      statusText={statusText}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <EnhancedQuickComboPresets
        onApplyCombo={handleComboClick}
        currentEffects={effectValues}
        selectedPresetId={selectedPresetId}
        onPresetSelect={onPresetSelect}
        isApplyingPreset={isApplyingPreset}
      />
    </CollapsibleSection>
  );
};
