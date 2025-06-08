
import React from 'react';
import { StylesSection } from '../sections/StylesSection';
import type { EffectValues } from '../../../hooks/useEnhancedCardEffects';

interface FramesTabProps {
  effectValues: EffectValues;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  onApplyCombo: (combo: any) => void;
  isApplyingPreset?: boolean;
}

export const FramesTab: React.FC<FramesTabProps> = ({
  effectValues,
  selectedPresetId,
  onPresetSelect,
  onApplyCombo,
  isApplyingPreset = false
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-white font-medium text-lg mb-2 flex items-center justify-center">
          🖼️ Card Frames
        </h3>
        <p className="text-crd-lightGray text-sm mb-4">
          Choose borders, templates, and frame designs for your card
        </p>
      </div>

      <StylesSection
        effectValues={effectValues}
        isOpen={true}
        onToggle={() => {}}
        selectedPresetId={selectedPresetId}
        onPresetSelect={onPresetSelect}
        onApplyCombo={onApplyCombo}
        isApplyingPreset={isApplyingPreset}
        showFramesFocus={true}
      />
    </div>
  );
};
