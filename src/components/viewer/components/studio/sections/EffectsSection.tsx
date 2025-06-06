
import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { StableEffectsList } from '../../StableEffectsList';
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
  return (
    <CollapsibleSection
      title="Effects"
      emoji="✨"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <StableEffectsList
        effectValues={effectValues}
        onEffectChange={onEffectChange}
        selectedPresetId={selectedPresetId}
      />
    </CollapsibleSection>
  );
};
