
import React from 'react';
import { StudioContent } from './StudioContent';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls, BackgroundType } from '../../types';
import type { SpaceEnvironment, SpaceControls } from '../../spaces/types';

interface ScrollableStudioContentProps {
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
  onSpaceChange?: (space: SpaceEnvironment) => void;
  selectedSpace?: SpaceEnvironment | null;
  spaceControls?: SpaceControls;
  onSpaceControlsChange?: (controls: SpaceControls) => void;
  onResetCamera?: () => void;
  physicsEnabled?: boolean;
  onPhysicsToggle?: () => void;
}

export const ScrollableStudioContent: React.FC<ScrollableStudioContentProps> = (props) => {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto overflow-x-hidden">
        <StudioContent {...props} />
      </div>
    </div>
  );
};
