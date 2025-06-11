
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { CollapsibleSection } from '@/components/ui/design-system/CollapsibleSection';
import { CleanEffectsList } from '../../CleanEffectsList';
import type { EffectValues } from '../../../hooks/useEnhancedCardEffects';

interface EffectsSectionProps {
  effectValues: EffectValues;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  selectedPresetId?: string;
  physicsEnabled?: boolean;
  onPhysicsToggle?: () => void;
}

export const EffectsSection: React.FC<EffectsSectionProps> = ({
  effectValues,
  isOpen,
  onToggle,
  onEffectChange,
  selectedPresetId,
  physicsEnabled = true,
  onPhysicsToggle = () => {}
}) => {
  return (
    <CollapsibleSection
      title="Visual Effects"
      icon={Sparkles}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        {/* Physics Toggle */}
        <div className="flex items-center justify-between p-3 bg-surface-light rounded-lg">
          <div>
            <label className="text-sm font-medium text-text-primary">
              Physics Effects
            </label>
            <p className="text-xs text-text-secondary mt-1">
              Enable random wobble and bounce when flipping cards
            </p>
          </div>
          <Switch
            checked={physicsEnabled}
            onCheckedChange={onPhysicsToggle}
          />
        </div>

        {/* Effects List */}
        <CleanEffectsList
          effectValues={effectValues}
          onEffectChange={onEffectChange}
          selectedPresetId={selectedPresetId}
        />
      </div>
    </CollapsibleSection>
  );
};
