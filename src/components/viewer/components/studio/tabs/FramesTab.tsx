
import React from 'react';
import { StylesSection } from '../sections/StylesSection';
import { EffectsSection } from '../sections/EffectsSection';
import type { EffectValues } from '../../../hooks/useEnhancedCardEffects';

interface FramesTabProps {
  effectValues: EffectValues;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  onApplyCombo: (combo: any) => void;
  isApplyingPreset?: boolean;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
}

export const FramesTab: React.FC<FramesTabProps> = ({
  effectValues,
  selectedPresetId,
  onPresetSelect,
  onApplyCombo,
  isApplyingPreset = false,
  onEffectChange
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-white font-medium text-lg mb-2 flex items-center justify-center">
          🖼️ Card Frames & Effects
        </h3>
        <p className="text-crd-lightGray text-sm mb-4">
          Choose styles, borders, and visual effects for your card
        </p>
      </div>

      {/* Styles Section */}
      <StylesSection
        effectValues={effectValues}
        isOpen={true}
        onToggle={() => {}}
        selectedPresetId={selectedPresetId}
        onPresetSelect={onPresetSelect}
        onApplyCombo={onApplyCombo}
        isApplyingPreset={isApplyingPreset}
      />

      {/* Effects Section */}
      <EffectsSection
        effectValues={effectValues}
        isOpen={true}
        onToggle={() => {}}
        onEffectChange={onEffectChange}
        selectedPresetId={selectedPresetId}
      />
    </div>
  );
};
