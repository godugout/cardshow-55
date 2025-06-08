
import React from 'react';
import { EffectsSection } from '../sections/EffectsSection';
import { SurfaceSection } from '../sections/SurfaceSection';
import { SpacesSection } from '../sections/SpacesSection';
import { useSectionManager } from '../hooks/useSectionManager';
import type { EffectValues } from '../../../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface AdvancedStudioTabProps {
  effectValues: EffectValues;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  interactiveLighting: boolean;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  selectedPresetId?: string;
  currentCard?: CardData;
}

export const AdvancedStudioTab: React.FC<AdvancedStudioTabProps> = ({
  effectValues,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness,
  interactiveLighting,
  onEffectChange,
  onMaterialSettingsChange,
  selectedPresetId,
  currentCard
}) => {
  const { sectionStates, setSectionState } = useSectionManager();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-white font-medium text-lg mb-2 flex items-center justify-center">
          ⚡ Advanced Studio
        </h3>
        <p className="text-crd-lightGray text-sm mb-4">
          Fine-tune effects, materials, and explore 3D spaces
        </p>
      </div>

      {/* Effects Section */}
      <EffectsSection
        effectValues={effectValues}
        isOpen={sectionStates.effects}
        onToggle={(isOpen) => setSectionState('effects', isOpen)}
        onEffectChange={onEffectChange}
        selectedPresetId={selectedPresetId}
      />

      {/* Spaces Section */}
      <SpacesSection
        isOpen={sectionStates.spaces}
        onToggle={(isOpen) => setSectionState('spaces', isOpen)}
        effectValues={effectValues}
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        materialSettings={materialSettings}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
        currentCard={currentCard}
      />

      {/* Surface Section */}
      <SurfaceSection
        materialSettings={materialSettings}
        isOpen={sectionStates.materials}
        onToggle={(isOpen) => setSectionState('materials', isOpen)}
        onMaterialSettingsChange={onMaterialSettingsChange}
      />
    </div>
  );
};
