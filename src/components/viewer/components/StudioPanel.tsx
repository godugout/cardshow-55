
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
  // AR-related props
  isCardInARMode?: boolean;
  cardZoom?: number;
}

export const StudioPanel: React.FC<StudioPanelProps> = ({
  isVisible,
  onClose,
  isCardInARMode = false,
  cardZoom = 1,
  ...studioProps
}) => {
  if (!isVisible) return null;

  const panelWidth = 320;
  
  // Calculate AR transparency based on card zoom and AR mode
  const arTransparency = React.useMemo(() => {
    if (!isCardInARMode) return 1;
    
    // Increase transparency when card is very zoomed in AR mode
    const zoomFactor = Math.max(0, (cardZoom - 1.2) / 0.8); // 0-1 range for zoom 1.2-2.0
    return Math.max(0.3, 1 - zoomFactor * 0.6); // Min 30% opacity, max 100%
  }, [isCardInARMode, cardZoom]);

  // Calculate blur effect for depth
  const backgroundBlur = React.useMemo(() => {
    if (!isCardInARMode) return 0;
    return Math.min((cardZoom - 1.2) * 2, 4); // Max 4px blur
  }, [isCardInARMode, cardZoom]);

  return (
    <div 
      className="fixed top-0 right-0 h-full z-50 transition-all duration-300" 
      style={{ 
        width: `${panelWidth}px`,
        transform: isCardInARMode && cardZoom > 1.8 ? 'translateX(10px)' : 'translateX(0)',
      }}
      onWheel={(e) => e.stopPropagation()}
    >
      <div 
        className="h-full border-l border-white/10 flex flex-col transition-all duration-300"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${0.95 * arTransparency})`,
          backdropFilter: `blur(${8 + backgroundBlur}px)`,
          borderLeftColor: isCardInARMode ? 
            `rgba(0, 200, 81, ${0.1 + (1 - arTransparency) * 0.2})` : 
            'rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Header with AR awareness */}
        <div 
          className="px-4 py-3 border-b flex items-center justify-between min-h-[3.5rem] transition-all duration-300"
          style={{
            borderBottomColor: isCardInARMode ? 
              `rgba(0, 200, 81, ${0.1 + (1 - arTransparency) * 0.1})` : 
              'rgba(255, 255, 255, 0.1)',
            backgroundColor: isCardInARMode ? 
              `rgba(0, 200, 81, ${(1 - arTransparency) * 0.05})` : 
              'transparent'
          }}
        >
          <h2 className="text-lg font-semibold text-white leading-none flex items-center space-x-2 mt-2">
            <Sparkles 
              className="w-5 h-5 flex-shrink-0 -mt-0.5 transition-colors duration-300" 
              style={{
                color: isCardInARMode ? 
                  `rgba(0, 200, 81, ${0.8 + (1 - arTransparency) * 0.2})` : 
                  'rgb(0, 200, 81)'
              }}
            />
            <span>Studio</span>
            {isCardInARMode && (
              <span 
                className="text-xs px-2 py-1 rounded-full font-medium transition-all duration-300"
                style={{
                  backgroundColor: `rgba(0, 200, 81, ${(1 - arTransparency) * 0.2})`,
                  color: 'rgba(0, 200, 81, 1)',
                  border: `1px solid rgba(0, 200, 81, ${(1 - arTransparency) * 0.3})`
                }}
              >
                AR Mode
              </span>
            )}
          </h2>
          <button 
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors flex-shrink-0"
            style={{
              opacity: arTransparency
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Content with AR transparency */}
        <div 
          style={{
            opacity: arTransparency
          }}
          className="transition-opacity duration-300"
        >
          <ScrollableStudioContent {...studioProps} />
        </div>

        {/* AR Mode indicator at bottom */}
        {isCardInARMode && (
          <div 
            className="absolute bottom-4 left-4 right-4 text-center text-xs text-white/60 transition-all duration-300"
            style={{
              backgroundColor: `rgba(0, 200, 81, ${(1 - arTransparency) * 0.1})`,
              border: `1px solid rgba(0, 200, 81, ${(1 - arTransparency) * 0.2})`,
              borderRadius: '8px',
              padding: '8px',
              backdropFilter: 'blur(4px)'
            }}
          >
            Card in AR mode • Zoom: {Math.round(cardZoom * 100)}%
          </div>
        )}
      </div>
    </div>
  );
};
