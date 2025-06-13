
import React from 'react';
import { useViewerEffectsManager } from '../hooks/useViewerEffectsManager';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

interface ViewerEffectsManagerProps {
  card: CardData;
  mousePosition: { x: number; y: number };
  showEffects: boolean;
  overallBrightness: number[];
  interactiveLighting: boolean;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  zoom: number;
  rotation: { x: number; y: number };
  isHovering: boolean;
  onEffectValuesChange: (values: EffectValues) => void;
  onPresetStateChange: (state: any) => void;
  children: (effectsManager: ReturnType<typeof useViewerEffectsManager>) => React.ReactNode;
}

export const ViewerEffectsManager: React.FC<ViewerEffectsManagerProps> = ({
  card,
  mousePosition,
  showEffects,
  overallBrightness,
  interactiveLighting,
  selectedScene,
  selectedLighting,
  materialSettings,
  zoom,
  rotation,
  isHovering,
  onEffectValuesChange,
  onPresetStateChange,
  children
}) => {
  const effectsManager = useViewerEffectsManager({
    card,
    mousePosition,
    showEffects,
    overallBrightness,
    interactiveLighting,
    selectedScene,
    selectedLighting,
    materialSettings,
    zoom,
    rotation,
    isHovering,
    onEffectValuesChange,
    onPresetStateChange
  });

  return <>{children(effectsManager)}</>;
};
