
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
  // AR mode props
  zoom?: number;
  isARMode?: boolean;
}

export const StudioPanel: React.FC<StudioPanelProps> = ({
  isVisible,
  onClose,
  zoom = 1,
  isARMode = false,
  ...studioProps
}) => {
  if (!isVisible) return null;

  const panelWidth = 320;

  // Calculate transparency based on AR mode and zoom level
  const backgroundOpacity = React.useMemo(() => {
    if (!isARMode) return 0.95;
    // Gradually become more transparent as zoom increases
    const transparencyFactor = Math.min((zoom - 1.5) * 0.3, 0.6);
    return Math.max(0.95 - transparencyFactor, 0.3);
  }, [isARMode, zoom]);

  const backdropBlur = React.useMemo(() => {
    if (!isARMode) return 'backdrop-blur-lg';
    // Increase blur in AR mode for better depth effect
    return 'backdrop-blur-xl';
  }, [isARMode]);

  return (
    <div 
      className="fixed top-0 right-0 h-full z-50" 
      style={{ width: `${panelWidth}px` }}
      onWheel={(e) => e.stopPropagation()}
    >
      <div 
        className={`h-full bg-black border-l border-white/10 flex flex-col ${backdropBlur} transition-all duration-300`}
        style={{
          backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity})`,
          borderLeftColor: isARMode ? 'rgba(0, 200, 81, 0.2)' : 'rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Header */}
        <div 
          className="px-4 py-3 border-b flex items-center justify-between min-h-[3.5rem] transition-all duration-300"
          style={{
            borderBottomColor: isARMode ? 'rgba(0, 200, 81, 0.2)' : 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <h2 className="text-lg font-semibold text-white leading-none flex items-center space-x-2 mt-2">
            <Sparkles 
              className={`w-5 h-5 flex-shrink-0 -mt-0.5 transition-colors duration-300 ${
                isARMode ? 'text-crd-primary' : 'text-crd-green'
              }`} 
            />
            <span>Studio</span>
            {isARMode && (
              <span className="text-xs bg-crd-primary/20 text-crd-primary px-2 py-0.5 rounded-full border border-crd-primary/30">
                AR
              </span>
            )}
          </h2>
          <button 
            onClick={onClose}
            className={`w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors flex-shrink-0 ${
              isARMode ? 'hover:text-crd-primary' : ''
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AR Mode Overlay Effect */}
        {isARMode && (
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: `
                  radial-gradient(circle at 30% 20%, rgba(0, 200, 81, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 70% 80%, rgba(0, 200, 81, 0.08) 0%, transparent 50%)
                `
              }}
            />
          </div>
        )}

        {/* Studio Content with Scroll Support */}
        <ScrollableStudioContent {...studioProps} />
      </div>
    </div>
  );
};
