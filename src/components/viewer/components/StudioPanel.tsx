
import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { ScrollableStudioContent } from './studio/ScrollableStudioContent';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings, EnvironmentControls, BackgroundType } from '../types';
import type { SpaceEnvironment, SpaceControls } from '../spaces/types';

interface StudioPanelProps {
  isVisible: boolean;
  onClose: () => void;
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
  enableTrue3D?: boolean;
  onToggle3D?: (enabled: boolean) => void;
}

export const StudioPanel: React.FC<StudioPanelProps> = ({
  isVisible,
  onClose,
  enableTrue3D = false,
  onToggle3D,
  ...studioProps
}) => {
  if (!isVisible) return null;

  const panelWidth = 320;

  return (
    <div 
      className="fixed top-0 right-0 h-full z-50" 
      style={{ width: `${panelWidth}px` }}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="h-full bg-black bg-opacity-95 backdrop-blur-lg border-l border-white/10 flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between min-h-[3.5rem]">
          <h2 className="text-lg font-semibold text-white leading-none flex items-center space-x-2 mt-2">
            <Sparkles className="w-5 h-5 text-crd-green flex-shrink-0 -mt-0.5" />
            <span>Studio</span>
          </h2>
          <button 
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Mode Toggle */}
        {onToggle3D && (
          <div className="px-4 py-2 border-b border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">3D Mode</span>
              <button
                onClick={() => onToggle3D(!enableTrue3D)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  enableTrue3D ? 'bg-crd-green' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enableTrue3D ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {enableTrue3D ? 'True 3D volumetric rendering' : 'Enhanced 2D effects system'}
            </p>
          </div>
        )}

        {/* Studio Content with Scroll Support */}
        <ScrollableStudioContent {...studioProps} />
      </div>
    </div>
  );
};
