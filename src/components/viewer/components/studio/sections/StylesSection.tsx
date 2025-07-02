
import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { EnhancedQuickComboPresets } from '../../EnhancedQuickComboPresets';
import { PremiumStyleSelector } from '../../premium/PremiumStyleSelector';
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
      <div className="space-y-6">
        {/* Premium Visual Styles */}
        <div>
          <h4 className="text-sm font-medium text-crd-lightGray mb-3">Premium Visual Styles</h4>
          <PremiumStyleSelector
            selectedStyleId={selectedPresetId}
            onStyleSelect={onPresetSelect}
            onStyleUnlock={(styleId) => {
              console.log('🔓 Unlock style:', styleId);
              // TODO: Implement unlock flow
            }}
          />
        </div>

        {/* Legacy Styles */}
        <div>
          <h4 className="text-sm font-medium text-crd-lightGray mb-3">Legacy Style Library</h4>
          <EnhancedQuickComboPresets
            onApplyCombo={onApplyCombo}
            currentEffects={effectValues}
            selectedPresetId={selectedPresetId}
            onPresetSelect={onPresetSelect}
            isApplyingPreset={isApplyingPreset}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};
