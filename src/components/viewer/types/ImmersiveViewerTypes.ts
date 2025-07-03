
import type { CardData } from '@/types/card';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../types';

export interface ImmersiveCardViewerProps {
  card: CardData;
  isOpen?: boolean;
  onClose?: () => void;
  onShare?: (card: CardData) => void;
  onDownload?: (card: CardData) => void;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
}

export interface ExtendedImmersiveCardViewerProps extends ImmersiveCardViewerProps {
  cards?: any[];
  currentCardIndex?: number;
  onCardChange?: (index: number) => void;
}

export interface ViewerState {
  // Viewer state
  isFullscreen: boolean;
  rotation: { x: number; y: number };
  isDragging: boolean;
  dragStart: { x: number; y: number };
  zoom: number;
  isFlipped: boolean;
  autoRotate: boolean;
  showEffects: boolean;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  isHoveringControls: boolean;

  // UI state
  showCustomizePanel: boolean;
  showExportDialog: boolean;

  // Environment state
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  overallBrightness: number[];
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  selectedPresetId: string | undefined;
  solidCardTransition: boolean;
  environmentControls: {
    depthOfField: number;
    parallaxIntensity: number;
    fieldOfView: number;
    atmosphericDensity: number;
  };

  // Effects state
  effectValues: EffectValues;
}
