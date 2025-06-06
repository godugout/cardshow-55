
import React, { useCallback } from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { EnhancedQuickComboPresets } from '../EnhancedQuickComboPresets';
import { StableEffectsList } from '../StableEffectsList';
import { EnvironmentSection } from '../EnvironmentSection';
import { MaterialPropertiesSection } from '../MaterialPropertiesSection';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../../types';

interface StudioContentProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  effectValues: EffectValues;
  overallBrightness: number[];
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  sectionStates: {
    effects: boolean;
    environment: boolean;
    materials: boolean;
  };
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  onSectionToggle: (section: string, isOpen: boolean) => void;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  onApplyCombo: (combo: any) => void;
  isApplyingPreset?: boolean;
}

export const StudioContent: React.FC<StudioContentProps> = ({
  selectedScene,
  selectedLighting,
  effectValues,
  overallBrightness,
  interactiveLighting,
  materialSettings,
  sectionStates,
  onSceneChange,
  onLightingChange,
  onEffectChange,
  onBrightnessChange,
  onInteractiveLightingToggle,
  onMaterialSettingsChange,
  onSectionToggle,
  selectedPresetId,
  onPresetSelect,
  onApplyCombo,
  isApplyingPreset = false
}) => {
  const handleBrightnessChange = useCallback(
    (value: number[]) => {
      onBrightnessChange(value);
    },
    [onBrightnessChange],
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Styles Section - Always Visible, No Header */}
        <div>
          <EnhancedQuickComboPresets
            onApplyCombo={onApplyCombo}
            currentEffects={effectValues}
            selectedPresetId={selectedPresetId}
            onPresetSelect={onPresetSelect}
            isApplyingPreset={isApplyingPreset}
          />
        </div>

        {/* Effects Section - Always visible with stable layout */}
        <CollapsibleSection
          title="Effects"
          emoji="✨"
          isOpen={sectionStates.effects}
          onToggle={(isOpen) => onSectionToggle('effects', isOpen)}
        >
          <StableEffectsList
            effectValues={effectValues}
            onEffectChange={onEffectChange}
            selectedPresetId={selectedPresetId}
          />
        </CollapsibleSection>

        {/* Scene Section */}
        <CollapsibleSection
          title="Scene"
          emoji="🌍"
          statusText={`${selectedScene.name} • ${selectedLighting.name}`}
          isOpen={sectionStates.environment}
          onToggle={(isOpen) => onSectionToggle('environment', isOpen)}
        >
          <EnvironmentSection
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            overallBrightness={overallBrightness}
            interactiveLighting={interactiveLighting}
            onSceneChange={onSceneChange}
            onLightingChange={onLightingChange}
            onBrightnessChange={handleBrightnessChange}
            onInteractiveLightingToggle={onInteractiveLightingToggle}
          />
        </CollapsibleSection>

        {/* Surface Section */}
        <CollapsibleSection
          title="Surface"
          emoji="💎"
          statusText="Custom Settings"
          isOpen={sectionStates.materials}
          onToggle={(isOpen) => onSectionToggle('materials', isOpen)}
        >
          <MaterialPropertiesSection
            materialSettings={materialSettings}
            onMaterialSettingsChange={onMaterialSettingsChange}
          />
        </CollapsibleSection>
      </div>
    </div>
  );
};
