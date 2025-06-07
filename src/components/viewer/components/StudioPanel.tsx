
import React from 'react';
import { Sparkles } from 'lucide-react';
import { ScrollableStudioContent } from './studio/ScrollableStudioContent';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import type { CardData } from '@/hooks/useCardEditor';

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
  currentCard?: CardData;
}

export const StudioPanel: React.FC<StudioPanelProps> = ({
  isVisible,
  onClose,
  currentCard,
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
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-crd-green" />
            <h2 className="text-lg font-semibold text-white">Studio</h2>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Studio Content with Scroll Support */}
        <ScrollableStudioContent {...studioProps} currentCard={currentCard} />
      </div>
    </div>
  );
};
