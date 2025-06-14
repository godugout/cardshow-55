
import React, { useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSectionManager } from './hooks/useSectionManager';
import { 
  StylesSection, 
  EffectsSection, 
  SceneSection, 
  SurfaceSection,
  SpacesSection 
} from './sections';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls, BackgroundType } from '../../types';

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
  environmentControls?: EnvironmentControls;
  onEnvironmentControlsChange?: (controls: EnvironmentControls) => void;
  backgroundType?: BackgroundType;
  onBackgroundTypeChange?: (type: BackgroundType) => void;
  onSpaceChange?: (space: any) => void;
  selectedSpace?: any;
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
  environmentControls = {
    depthOfField: 1.0,
    parallaxIntensity: 1.0,
    fieldOfView: 75,
    atmosphericDensity: 1.0
  },
  onEnvironmentControlsChange = () => {},
  backgroundType = 'scene',
  onBackgroundTypeChange = () => {},
  onSpaceChange = () => {},
  selectedSpace
}) => {
  const { sectionStates, setSectionState } = useSectionManager();

  const handleBrightnessChange = useCallback(
    (value: number[]) => {
      onBrightnessChange(value);
    },
    [onBrightnessChange],
  );

  // Initialize space controls with default values
  const [spaceControls, setSpaceControls] = React.useState({
    orbitSpeed: 0.5,
    floatIntensity: 1.0,
    cameraDistance: 8.0,
    autoRotate: false,
    gravityEffect: 0.2
  });

  const handleResetCamera = () => {
    setSpaceControls(prev => ({
      ...prev,
      cameraDistance: 8.0,
      orbitSpeed: 0.5,
      autoRotate: false
    }));
  };

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

          {/* Unified Spaces & Environment Section */}
          <SpacesSection
            selectedSpace={selectedSpace}
            spaceControls={spaceControls}
            selectedScene={selectedScene}
            environmentControls={environmentControls}
            isOpen={sectionStates.spaces || false}
            onToggle={(isOpen) => setSectionState('spaces', isOpen)}
            onSpaceChange={onSpaceChange}
            onSpaceControlsChange={setSpaceControls}
            onSceneChange={onSceneChange}
            onEnvironmentControlsChange={onEnvironmentControlsChange}
            onResetCamera={handleResetCamera}
            backgroundType={backgroundType}
            onBackgroundTypeChange={onBackgroundTypeChange}
          />

          {/* Scene Section - Keep for lighting only */}
          <SceneSection
            selectedScene={selectedScene}
            selectedLighting={selectedLighting}
            overallBrightness={overallBrightness}
            interactiveLighting={interactiveLighting}
            isOpen={sectionStates.lighting || false}
            onToggle={(isOpen) => setSectionState('lighting', isOpen)}
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
