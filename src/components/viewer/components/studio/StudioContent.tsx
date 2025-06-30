
import React, { useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSectionManager } from './hooks/useSectionManager';
import { 
  StylesSection, 
  EffectsSection, 
  SpacesSection,
  SurfaceSection,
  LightingSection
} from './sections';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../../types';

interface StudioContentProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  effectValues: EffectValues;
  overallBrightness: number[];
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  onApplyCombo: (combo: any) => void;
  isApplyingPreset?: boolean;
  onExpandEffects?: () => void; // Add the missing prop
}

export const StudioContent: React.FC<StudioContentProps> = ({
  selectedScene,
  selectedLighting,
  effectValues,
  overallBrightness,
  interactiveLighting,
  materialSettings,
  onSceneChange,
  onLightingChange,
  onEffectChange,
  onBrightnessChange,
  onInteractiveLightingToggle,
  onMaterialSettingsChange,
  selectedPresetId,
  onPresetSelect,
  onApplyCombo,
  isApplyingPreset = false,
  onExpandEffects
}) => {
  const { sectionStates, setSectionState } = useSectionManager();

  const handleBrightnessChange = useCallback(
    (value: number[]) => {
      onBrightnessChange(value);
    },
    [onBrightnessChange],
  );

  return (
    <div className="flex-1 min-h-0">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {/* Styles Section */}
          <StylesSection
            effectValues={effectValues}
            isOpen={sectionStates.styles !== false}
            onToggle={(isOpen) => setSectionState('styles', isOpen)}
            selectedPresetId={selectedPresetId}
            onPresetSelect={onPresetSelect}
            onApplyCombo={onApplyCombo}
            isApplyingPreset={isApplyingPreset}
            onExpandEffects={onExpandEffects}
          />

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
            selectedScene={selectedScene}
            isOpen={sectionStates.spaces}
            onToggle={(isOpen) => setSectionState('spaces', isOpen)}
            onSceneChange={onSceneChange}
          />
          
          {/* Lighting Section */}
          <LightingSection
            selectedLighting={selectedLighting}
            overallBrightness={overallBrightness}
            interactiveLighting={interactiveLighting}
            isOpen={sectionStates.lighting}
            onToggle={(isOpen) => setSectionState('lighting', isOpen)}
            onLightingChange={onLightingChange}
            onBrightnessChange={handleBrightnessChange}
            onInteractiveLightingToggle={onInteractiveLightingToggle}
          />

          {/* Surface Section */}
          <SurfaceSection
            materialSettings={materialSettings}
            isOpen={sectionStates.materials}
            onToggle={(isOpen) => setSectionState('materials', isOpen)}
            onMaterialSettingsChange={onMaterialSettingsChange}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
