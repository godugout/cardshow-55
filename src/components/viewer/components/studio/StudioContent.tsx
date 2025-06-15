
import React, { useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSectionManager } from './hooks/useSectionManager';
import { 
  StylesSection, 
  EffectsSection, 
  SceneSection, 
  SurfaceSection
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
  isApplyingPreset = false
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
          />

          {/* Effects Section */}
          <EffectsSection
            effectValues={effectValues}
            isOpen={sectionStates.effects}
            onToggle={(isOpen) => setSectionState('effects', isOpen)}
            onEffectChange={onEffectChange}
            selectedPresetId={selectedPresetId}
          />

          {/* Scene Section - For environment, lighting, and brightness */}
          <SceneSection
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            overallBrightness={overallBrightness}
            interactiveLighting={interactiveLighting}
            isOpen={sectionStates.scene !== false}
            onToggle={(isOpen) => setSectionState('scene', isOpen)}
            onSceneChange={onSceneChange}
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
