
import React from 'react';
import { Sparkles } from 'lucide-react';
import { TabbedStudioContent } from './studio/TabbedStudioContent';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';
import type { CardData } from '@/hooks/useCardEditor';
import type { SpaceState, SpaceTemplate } from '../types/spaces';

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
  // New spaces integration props
  spaceState?: SpaceState;
  spacesTemplates?: SpaceTemplate[];
  onTemplateSelect?: (template: SpaceTemplate | null) => void;
  onAddCardToSpace?: () => void;
  onRemoveCardFromSpace?: (cardId: string) => void;
  onToggleEditMode?: () => void;
}

export const StudioPanel: React.FC<StudioPanelProps> = ({
  isVisible,
  onClose,
  currentCard,
  spaceState,
  spacesTemplates,
  onTemplateSelect,
  onAddCardToSpace,
  onRemoveCardFromSpace,
  onToggleEditMode,
  ...studioProps
}) => {
  if (!isVisible) return null;

  const panelWidth = 380;

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
            {spaceState?.selectedTemplate && (
              <span className="text-xs bg-crd-green/20 text-crd-green px-2 py-1 rounded-full">
                3D Mode
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Tabbed Studio Content with Spaces Integration */}
        <TabbedStudioContent 
          {...studioProps} 
          currentCard={currentCard}
          spaceState={spaceState}
          spacesTemplates={spacesTemplates}
          onTemplateSelect={onTemplateSelect}
          onAddCardToSpace={onAddCardToSpace}
          onRemoveCardFromSpace={onRemoveCardFromSpace}
          onToggleEditMode={onToggleEditMode}
        />
      </div>
    </div>
  );
};
