
import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { CleanEffectsList } from '../../CleanEffectsList';
import type { EffectValues } from '../../../hooks/useEnhancedCardEffects';

interface EffectsSectionProps {
  effectValues: EffectValues;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  selectedPresetId?: string;
}

export const EffectsSection: React.FC<EffectsSectionProps> = ({
  effectValues,
  isOpen,
  onToggle,
  onEffectChange,
  selectedPresetId
}) => {
  // Count active effects
  const activeEffectsCount = Object.values(effectValues || {}).filter(effect => {
    const intensity = effect.intensity;
    return typeof intensity === 'number' && intensity > 0;
  }).length;

  return (
    <CollapsibleSection
      title="Effects"
      emoji="✨"
      statusCount={activeEffectsCount}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <CleanEffectsList
        effectValues={effectValues}
        onEffectChange={onEffectChange}
        selectedPresetId={selectedPresetId}
      />
    </CollapsibleSection>
  );
};
